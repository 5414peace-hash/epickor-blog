import { NextRequest, NextResponse } from 'next/server';
import { getStudioPosts } from '@/lib/studio-posts';
import { getViewsForRange, loadCounterStore } from '@/lib/view-counter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RangeMode = 'today' | '7d' | '30d' | '90d' | 'custom';

interface ResolvedRange {
  mode: RangeMode;
  startDate: string;
  endDate: string;
  warning?: string;
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function resolveDateRange(searchParams: URLSearchParams): ResolvedRange {
  const modeParam = searchParams.get('range');
  const mode: RangeMode =
    modeParam === 'today' || modeParam === '7d' || modeParam === '90d' || modeParam === 'custom'
      ? modeParam
      : '30d';
  const now = new Date();
  const endDate = formatUtcDate(now);

  if (mode === 'custom') {
    const start = searchParams.get('start') || '';
    const end = searchParams.get('end') || '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(start) && /^\d{4}-\d{2}-\d{2}$/.test(end)) {
      return {
        mode,
        startDate: start,
        endDate: end,
      };
    }

    const fallbackStart = new Date(now);
    fallbackStart.setUTCDate(fallbackStart.getUTCDate() - 29);
    return {
      mode,
      startDate: formatUtcDate(fallbackStart),
      endDate,
      warning: 'Invalid custom range, defaulted to last 30 days.',
    };
  }

  const days = mode === 'today' ? 1 : mode === '7d' ? 7 : mode === '90d' ? 90 : 30;
  const startDate = new Date(now);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

  return {
    mode,
    startDate: formatUtcDate(startDate),
    endDate,
  };
}

function listDateKeys(startDate: string, endDate: string): string[] {
  const keys: string[] = [];
  const cursor = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  while (cursor.getTime() <= end.getTime()) {
    keys.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return keys;
}

export async function GET(request: NextRequest) {
  try {
    const range = resolveDateRange(request.nextUrl.searchParams);
    const posts = getStudioPosts();
    const token = request.headers.get('x-github-token') || undefined;
    const counter = await loadCounterStore(token);
    const includeRows = request.nextUrl.searchParams.get('includeRows') === '1';

    const allRows = posts.map((post) => {
      const path = `/blog/${post.slug}`;
      const views = getViewsForRange(counter.store, post.slug, range.startDate, range.endDate);
      const totalViews = counter.store.totals[post.slug] || 0;

      return {
        ...post,
        path,
        views,
        totalViews,
      };
    });

    const totalViews = allRows.reduce((sum, row) => sum + row.views, 0);
    const dateKeys = listDateKeys(range.startDate, range.endDate);
    const dailySeries = dateKeys.map((dateKey) => {
      const bucket = counter.store.daily[dateKey] || {};
      const views = Object.values(bucket).reduce((sum, v) => sum + (Number(v) || 0), 0);
      return {
        date: dateKey,
        views,
      };
    });

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      range: {
        mode: range.mode,
        startDate: range.startDate,
        endDate: range.endDate,
      },
      warning: range.warning || counter.warning || null,
      summary: {
        postCount: allRows.length,
        totalViews,
      },
      dailySeries,
      rows: includeRows ? allRows : [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown dashboard error';
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
