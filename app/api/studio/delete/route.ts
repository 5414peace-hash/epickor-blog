import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { deleteFileFromGithub, putFileToGithub } from '@/lib/github-repo';
import { loadCounterStore, type ViewCounterStore } from '@/lib/view-counter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VIEW_COUNTER_PATH = 'content/data/post-views.json';

interface DeleteRequestBody {
  token?: string;
  fileName?: string;
  slug?: string;
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

function normalizeSlug(value: string | undefined): string {
  const normalized = String(value || '').trim();
  if (!normalized || !/^[A-Za-z0-9_-]{1,120}$/.test(normalized)) {
    throw new Error('Invalid slug.');
  }
  return normalized;
}

function normalizeFileName(value: string | undefined): string {
  const normalized = String(value || '').trim();
  if (!normalized) {
    throw new Error('fileName is required.');
  }
  if (normalized.includes('/') || normalized.includes('\\') || normalized.includes('..')) {
    throw new Error('Invalid fileName path.');
  }
  if (!/^[A-Za-z0-9._-]+\.md$/i.test(normalized)) {
    throw new Error('fileName must be a .md file.');
  }
  return normalized;
}

function stripMdExtension(fileName: string): string {
  return fileName.replace(/\.md$/i, '');
}

function removeSlugFromCounterStore(store: ViewCounterStore, slug: string): {
  next: ViewCounterStore;
  changed: boolean;
} {
  const nextTotals = { ...store.totals };
  let changed = false;

  if (Object.prototype.hasOwnProperty.call(nextTotals, slug)) {
    delete nextTotals[slug];
    changed = true;
  }

  const nextDaily: ViewCounterStore['daily'] = {};
  Object.entries(store.daily).forEach(([dateKey, bucket]) => {
    const nextBucket = { ...bucket };
    if (Object.prototype.hasOwnProperty.call(nextBucket, slug)) {
      delete nextBucket[slug];
      changed = true;
    }
    if (Object.keys(nextBucket).length > 0) {
      nextDaily[dateKey] = nextBucket;
    }
  });

  return {
    next: {
      updatedAt: new Date().toISOString(),
      totals: nextTotals,
      daily: nextDaily,
    },
    changed,
  };
}

async function cleanupViewCounter(slug: string, token: string): Promise<string | null> {
  try {
    const loaded = await loadCounterStore(token);
    const { next, changed } = removeSlugFromCounterStore(loaded.store, slug);
    if (!changed) {
      return loaded.warning || null;
    }

    await putFileToGithub(
      VIEW_COUNTER_PATH,
      JSON.stringify(next, null, 2),
      `[studio] remove counter ${slug}`,
      { sha: loaded.sha, overrideToken: token }
    );

    return loaded.warning || null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Counter cleanup failed.';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DeleteRequestBody;
    const token = resolveToken(request, body.token);
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is missing. Login in /admin or set STUDIO_GITHUB_TOKEN.' },
        { status: 401 }
      );
    }

    const resolvedFileName = body.fileName
      ? normalizeFileName(body.fileName)
      : `${normalizeSlug(body.slug)}.md`;
    const resolvedSlug = body.slug ? normalizeSlug(body.slug) : stripMdExtension(resolvedFileName);
    const targetPath = `content/blog/${resolvedFileName}`;

    const deleted = await deleteFileFromGithub(
      targetPath,
      `[studio] delete post ${resolvedSlug}`,
      { overrideToken: token }
    );

    if (!deleted) {
      return NextResponse.json({ error: `Post file not found: ${targetPath}` }, { status: 404 });
    }

    const warning = await cleanupViewCounter(resolvedSlug, token);

    revalidatePath('/');
    revalidatePath('/studio');
    revalidatePath('/studio/list');
    revalidatePath(`/blog/${resolvedSlug}`);

    return NextResponse.json({
      ok: true,
      path: targetPath,
      slug: resolvedSlug,
      ...(warning ? { warning } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'delete failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

