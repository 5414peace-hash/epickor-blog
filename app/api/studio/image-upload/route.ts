import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveToken(request: NextRequest): string {
  return (
    request.headers.get('x-github-token') ||
    process.env.STUDIO_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PAT ||
    ''
  );
}

function resolveExt(fileName: string, mimeType: string): string {
  const fromName = (fileName.split('.').pop() || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fromName)) return fromName;

  const mimeExt = (mimeType.split('/').pop() || '').toLowerCase();
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(mimeExt)) return mimeExt;

  return 'png';
}

export async function POST(request: NextRequest) {
  try {
    const token = resolveToken(request);
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token is missing. Login in /admin or set STUDIO_GITHUB_TOKEN.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const slugRaw = formData.get('slug');
    const slug = typeof slugRaw === 'string' ? slugRaw.trim() : '';

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const ext = resolveExt(file.name || '', file.type || '');
    const filename = `${slug}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const repoPath = `public/assets/images/posts/${slug}/${filename}`;
    const publicPath = `/assets/images/posts/${slug}/${filename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString('base64');
    const repo = process.env.STUDIO_REPO || '5414peace-hash/epickor-blog';
    const branch = process.env.STUDIO_BRANCH || 'master';
    const [owner, name] = repo.split('/');
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/contents/${repoPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `[studio] upload image ${slug}`,
        content,
        branch,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: `GitHub image upload failed: ${text.slice(0, 260)}` }, { status: 500 });
    }

    const json = (await response.json()) as {
      content?: {
        download_url?: string;
      };
    };
    const rawPath =
      json.content?.download_url ||
      `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${repoPath}`;

    return NextResponse.json({
      ok: true,
      path: rawPath,
      publicPath,
      repoPath,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'image upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
