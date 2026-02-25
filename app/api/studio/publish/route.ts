import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { buildMarkdownContent, type ParsedMdPayload } from '@/lib/studio-markdown';
import { getFileFromGithub, putFileToGithub } from '@/lib/github-repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PublishRequestBody {
  token?: string;
  payload?: ParsedMdPayload;
  mode?: 'now' | 'schedule' | 'private';
}

function resolveToken(request: NextRequest, bodyToken?: string): string {
  const headerToken = request.headers.get('x-github-token') || '';
  return (
    bodyToken ||
    headerToken ||
    process.env.STUDIO_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PAT ||
    ''
  );
}

function normalizeMode(mode: string | undefined): 'now' | 'schedule' | 'private' {
  if (mode === 'schedule') return 'schedule';
  if (mode === 'private') return 'private';
  return 'now';
}

function applyMode(payload: ParsedMdPayload, mode: 'now' | 'schedule' | 'private'): ParsedMdPayload {
  const next = { ...payload };
  if (mode === 'private') {
    next.visibility = 'private';
    next.publishAt = '';
    return next;
  }
  if (mode === 'now') {
    next.visibility = 'public';
    next.publishAt = '';
    return next;
  }
  next.visibility = 'public';
  if (!next.publishAt) {
    throw new Error('Schedule mode requires publishAt.');
  }
  return next;
}

function sanitizeBodyBeforePublish(body: string): string {
  if (!body) return '';

  const removedTokenImages = body.replace(
    /!\[[^\]]*\]\((%7B%7B[^)]+%7D%7D|\{\{[^)]+\}\})\)/gi,
    ''
  );
  const removedTokenLines = removedTokenImages.replace(
    /^\s*\{\{\s*IMAGE[_-]?\d+\s*\}\}\s*$/gim,
    ''
  );

  return removedTokenLines.replace(/\n{3,}/g, '\n\n').trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PublishRequestBody;
    const token = resolveToken(request, body.token);
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is missing. Login in /admin or set STUDIO_GITHUB_TOKEN.' },
        { status: 401 }
      );
    }

    if (!body.payload) {
      return NextResponse.json({ error: 'payload is required' }, { status: 400 });
    }

    const mode = normalizeMode(body.mode);
    const payload = applyMode(body.payload, mode);
    const sanitizedPayload: ParsedMdPayload = {
      ...payload,
      body: sanitizeBodyBeforePublish(payload.body || ''),
    };

    if (!sanitizedPayload.slug || !sanitizedPayload.title || !sanitizedPayload.date) {
      return NextResponse.json({ error: 'title, slug, date are required.' }, { status: 400 });
    }

    const targetPath = `content/blog/${sanitizedPayload.slug}.md`;
    const existing = await getFileFromGithub(targetPath, token);
    const markdown = buildMarkdownContent(sanitizedPayload);
    const normalizedExisting = (existing?.content || '').replace(/\r\n/g, '\n').trim();
    const normalizedNext = markdown.replace(/\r\n/g, '\n').trim();

    if (existing && normalizedExisting === normalizedNext) {
      return NextResponse.json({
        ok: true,
        path: targetPath,
        mode,
        created: false,
        changed: false,
        postUrl: `/blog/${sanitizedPayload.slug}`,
        message: 'No content changes detected; publish skipped.',
      });
    }

    const commitMessage = existing
      ? `[studio] update post ${sanitizedPayload.slug}`
      : `[studio] create post ${sanitizedPayload.slug}`;

    await putFileToGithub(targetPath, markdown, commitMessage, {
      sha: existing?.sha,
      overrideToken: token,
    });

    // Ensure list/post caches are invalidated immediately after publish.
    revalidatePath('/');
    revalidatePath('/studio');
    revalidatePath('/studio/list');
    revalidatePath(`/blog/${sanitizedPayload.slug}`);

    return NextResponse.json({
      ok: true,
      path: targetPath,
      mode,
      created: !existing,
      changed: true,
      postUrl: `/blog/${sanitizedPayload.slug}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'publish failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
