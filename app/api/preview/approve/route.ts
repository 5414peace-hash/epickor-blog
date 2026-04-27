import { NextRequest, NextResponse } from 'next/server';
import { getFileFromGithub, putFileToGithub } from '@/lib/github-repo';

export async function POST(request: NextRequest) {
  try {
    const { slug, token } = await request.json();

    const secret = process.env.PREVIEW_SECRET_TOKEN;
    const isLocalPreview = process.env.NODE_ENV !== 'production';
    if (!isLocalPreview && (!secret || token !== secret)) {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 });
    }

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'slug가 필요합니다' }, { status: 400 });
    }

    const filePath = `content/blog/${slug}.md`;
    const file = await getFileFromGithub(filePath);

    if (!file) {
      return NextResponse.json({ error: '파일을 찾을 수 없습니다' }, { status: 404 });
    }

    // visibility: private → public
    const updated = file.content.replace(
      /^(visibility:\s*)["\']?private["\']?/m,
      '$1"public"'
    );

    if (updated === file.content) {
      // 이미 public이거나 visibility 필드 없음 → 그냥 성공 처리
      return NextResponse.json({ ok: true, message: '이미 public 상태입니다' });
    }

    await putFileToGithub(filePath, updated, `publish: approve post ${slug}`, {
      sha: file.sha,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
