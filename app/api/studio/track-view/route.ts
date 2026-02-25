import { NextRequest, NextResponse } from 'next/server';
import { incrementPostView } from '@/lib/view-counter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as { slug?: string };
    const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const result = await incrementPostView(slug);
    return NextResponse.json({
      ok: true,
      warning: result.warning || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'track view failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

