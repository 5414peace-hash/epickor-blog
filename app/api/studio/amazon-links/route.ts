import { NextRequest, NextResponse } from 'next/server';
import { loadAmazonLinks, saveAmazonLinks, type AmazonProduct } from '@/lib/amazon-links';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveToken(request: NextRequest, bodyToken?: string): string {
  return (
    bodyToken ||
    request.headers.get('x-github-token') ||
    process.env.STUDIO_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GITHUB_PAT ||
    ''
  );
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('x-github-token') || '';
    const result = await loadAmazonLinks(token || undefined);
    return NextResponse.json({
      products: result.products,
      warning: result.warning || null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to load amazon links';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { token?: string; products?: AmazonProduct[] };
    const token = resolveToken(request, body.token);
    if (!token) {
      return NextResponse.json({ error: 'GitHub token is required to save amazon links.' }, { status: 401 });
    }

    const products = Array.isArray(body.products) ? body.products : null;
    if (!products) {
      return NextResponse.json({ error: 'products array is required' }, { status: 400 });
    }

    await saveAmazonLinks(products, token);
    return NextResponse.json({ ok: true, count: products.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'failed to save amazon links';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

