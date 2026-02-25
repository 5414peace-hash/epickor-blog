'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type RangeMode = 'today' | '7d' | '30d' | '90d' | 'custom';

interface DailyPoint {
  date: string;
  views: number;
}

interface DashboardPayload {
  generatedAt: string;
  range: {
    mode: RangeMode;
    startDate: string;
    endDate: string;
  };
  warning: string | null;
  summary: {
    postCount: number;
    totalViews: number;
  };
  dailySeries: DailyPoint[];
  rows: Array<unknown>;
}

function extractGithubTokenFromStorage(): string {
  const tryKeys = ['decap-cms-user', 'netlify-cms-user'];
  for (const key of tryKeys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as {
        token?: string;
        access_token?: string;
        backend?: { token?: string; access_token?: string };
      };
      const token =
        parsed.backend?.token ||
        parsed.backend?.access_token ||
        parsed.token ||
        parsed.access_token ||
        '';
      if (token) return token;
    } catch (_e) {
      // ignore parse errors
    }
  }
  return '';
}

function getDefaultCustomStart(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 29);
  return d.toISOString().slice(0, 10);
}

function getTodayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateLabel(value: string): string {
  if (!value) return '';
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
}

function formatLocal(value: string): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function buildPath(points: DailyPoint[], width: number, height: number): string {
  if (!points.length) return '';

  const padding = 18;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxViews = Math.max(...points.map((p) => p.views), 1);
  const stepX = points.length > 1 ? chartWidth / (points.length - 1) : 0;

  return points
    .map((point, index) => {
      const x = padding + stepX * index;
      const y = padding + chartHeight - (point.views / maxViews) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');
}

function calcPeak(points: DailyPoint[]): DailyPoint | null {
  if (!points.length) return null;
  return [...points].sort((a, b) => b.views - a.views)[0] || null;
}

export default function StudioDashboardPage() {
  const [rangeMode, setRangeMode] = useState<RangeMode>('30d');
  const [customStart, setCustomStart] = useState<string>(getDefaultCustomStart());
  const [customEnd, setCustomEnd] = useState<string>(getTodayUtc());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [data, setData] = useState<DashboardPayload | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('range', rangeMode);
    params.set('includeRows', '0');
    if (rangeMode === 'custom') {
      params.set('start', customStart);
      params.set('end', customEnd);
    }
    return params.toString();
  }, [rangeMode, customStart, customEnd]);

  useEffect(() => {
    let canceled = false;

    async function loadDashboard() {
      setLoading(true);
      setError('');
      setWarning('');

      try {
        const token = extractGithubTokenFromStorage();
        const response = await fetch(`/api/studio/dashboard?${queryString}`, {
          cache: 'no-store',
          headers: token ? { 'x-github-token': token } : undefined,
        });
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || `Dashboard API failed (${response.status})`);
        }

        if (canceled) return;
        setData(json as DashboardPayload);
        if (json.warning) {
          setWarning(String(json.warning));
        }
      } catch (err) {
        if (canceled) return;
        setError(err instanceof Error ? err.message : 'Unknown dashboard error');
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      canceled = true;
    };
  }, [queryString]);

  const chartPoints = data?.dailySeries || [];
  const chartPath = useMemo(() => buildPath(chartPoints, 900, 260), [chartPoints]);
  const peak = useMemo(() => calcPeak(chartPoints), [chartPoints]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Studio Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Internal view analytics (self-hosted counter). Full post list moved to List menu.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/studio/new" className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
              New Blog
            </Link>
            <Link href="/studio/list" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              List
            </Link>
            <Link href="/studio/amazon-links" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Amazon Link
            </Link>
            <a href="/admin/bulk-update.html" target="_blank" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Bulk Manager
            </a>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Range
            <select
              className="rounded border border-gray-300 px-3 py-2 text-sm"
              value={rangeMode}
              onChange={(e) => setRangeMode(e.target.value as RangeMode)}
            >
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          {rangeMode === 'custom' ? (
            <>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Start (UTC)
                <input
                  type="date"
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                End (UTC)
                <input
                  type="date"
                  className="rounded border border-gray-300 px-3 py-2 text-sm"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </label>
            </>
          ) : null}
        </div>
      </div>

      {warning ? (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warning}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Posts</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{loading ? '-' : data?.summary.postCount ?? 0}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Total Views (Range)</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {loading ? '-' : (data?.summary.totalViews ?? 0).toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Peak Day (Views)</div>
          <div className="mt-2 text-sm font-semibold text-gray-900">
            {loading ? '-' : peak ? `${formatDateLabel(peak.date)} (${peak.views.toLocaleString()})` : 'No data'}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Last Updated</div>
          <div className="mt-2 text-sm font-semibold text-gray-900">
            {loading ? '-' : formatLocal(data?.generatedAt || '')}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Views Trend</h2>
          <div className="text-xs text-gray-500">UTC daily aggregate</div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">Loading chart...</div>
        ) : chartPoints.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-500">No view data in this range.</div>
        ) : (
          <>
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 900 260" className="h-64 min-w-[780px] w-full">
                <defs>
                  <linearGradient id="lineFade" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="900" height="260" fill="#ffffff" />
                <line x1="18" y1="242" x2="882" y2="242" stroke="#e5e7eb" strokeWidth="1" />
                <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" points={chartPath} />
                <polygon fill="url(#lineFade)" stroke="none" points={`${chartPath} 882,242 18,242`} />
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{formatDateLabel(data?.range.startDate || '')}</span>
              <span>{formatDateLabel(data?.range.endDate || '')}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
