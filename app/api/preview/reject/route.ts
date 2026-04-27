import { NextRequest, NextResponse } from 'next/server';
import { deleteFileFromGithub } from '@/lib/github-repo';

export async function POST(request: NextRequest) {
  try {
    const { slug, token } = await request.json();

    const secret = process.env.PREVIEW_SECRET_TOKEN;
    const isLocalPreview = process.env.NODE_ENV !== 'production';
    if (!isLocalPreview && (!secret || token !== secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const filePath = `content/blog/${slug}.md`;
    const deleted = await deleteFileFromGithub(filePath, `reject: delete draft post ${slug}`);

    if (!deleted) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
