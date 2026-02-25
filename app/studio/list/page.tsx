'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type RangeMode = 'today' | '7d' | '30d' | '90d' | 'custom';
type PostStatus = 'public' | 'private' | 'scheduled';

interface DashboardRow {
  slug: string;
  title: string;
  date: string;
  visibility: 'public' | 'private';
  publishAt: string;
  status: PostStatus;
  lastModified: string;
  fileName: string;
  path: string;
  views: number;
  totalViews: number;
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
  rows: DashboardRow[];
}

interface DeletePostResponse {
  ok?: boolean;
  error?: string;
  path?: string;
  slug?: string;
  warning?: string;
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
      // ignore
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

function formatDate(value: string): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatLocal(value: string): string {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

async function parseJsonResponse<T>(response: Response, context: string): Promise<T> {
  const text = await response.text();
  try {
    return (text ? JSON.parse(text) : {}) as T;
  } catch (_error) {
    throw new Error(`${context} returned non-JSON (${response.status}).`);
  }
}

export default function StudioListPage() {
  const [rangeMode, setRangeMode] = useState<RangeMode>('30d');
  const [customStart, setCustomStart] = useState<string>(getDefaultCustomStart());
  const [customEnd, setCustomEnd] = useState<string>(getTodayUtc());
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [deletingFileName, setDeletingFileName] = useState<string>('');
  const [data, setData] = useState<DashboardPayload | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('range', rangeMode);
    params.set('includeRows', '1');
    if (rangeMode === 'custom') {
      params.set('start', customStart);
      params.set('end', customEnd);
    }
    return params.toString();
  }, [rangeMode, customStart, customEnd]);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setStatus('');
      setError('');
      setWarning('');
      try {
        const token = extractGithubTokenFromStorage();
        const response = await fetch(`/api/studio/dashboard?${queryString}`, {
          cache: 'no-store',
          headers: token ? { 'x-github-token': token } : undefined,
        });
        const json = await parseJsonResponse<DashboardPayload & { error?: string }>(
          response,
          'List API'
        );
        if (!response.ok) {
          throw new Error(json.error || `List API failed (${response.status})`);
        }
        if (canceled) return;
        setData(json);
        if (json.warning) setWarning(String(json.warning));
      } catch (err) {
        if (canceled) return;
        setError(err instanceof Error ? err.message : 'Failed to load list');
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    void load();
    return () => {
      canceled = true;
    };
  }, [queryString]);

  const handleDelete = async (row: DashboardRow) => {
    setStatus('');
    setError('');
    setWarning('');

    const ok = window.confirm(
      `Delete post ${row.slug}?\n\nTitle: ${row.title}\n\nThis will permanently remove content/blog/${row.fileName}`
    );
    if (!ok) return;

    try {
      setDeletingFileName(row.fileName);
      const token = extractGithubTokenFromStorage();
      const response = await fetch('/api/studio/delete', {
        method: 'POST',
        headers: token
          ? {
              'Content-Type': 'application/json',
              'x-github-token': token,
            }
          : {
              'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          fileName: row.fileName,
          slug: row.slug,
        }),
      });

      const json = await parseJsonResponse<DeletePostResponse>(response, 'Delete API');
      if (!response.ok || !json.ok) {
        throw new Error(json.error || `Delete failed (${response.status})`);
      }

      setData((prev) => {
        if (!prev) return prev;
        const nextRows = prev.rows.filter((item) => item.fileName !== row.fileName);
        const nextTotalViews = Math.max(0, prev.summary.totalViews - row.views);
        return {
          ...prev,
          rows: nextRows,
          summary: {
            postCount: nextRows.length,
            totalViews: nextTotalViews,
          },
        };
      });

      if (json.warning) {
        setWarning(json.warning);
      }
      setStatus(`Deleted: ${row.fileName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingFileName('');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post List</h1>
          <p className="mt-2 text-sm text-gray-600">All published/scheduled/private posts with views.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/studio" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Dashboard
          </Link>
          <Link href="/studio/new" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            New Blog
          </Link>
          <Link href="/studio/amazon-links" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Amazon Link
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Range
            <select className="rounded border border-gray-300 px-3 py-2 text-sm" value={rangeMode} onChange={(e) => setRangeMode(e.target.value as RangeMode)}>
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
                <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                End (UTC)
                <input type="date" className="rounded border border-gray-300 px-3 py-2 text-sm" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
              </label>
            </>
          ) : null}
        </div>
      </div>

      {status ? <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{status}</div> : null}
      {warning ? <div className="mb-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{warning}</div> : null}
      {error ? <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Slug</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Title</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Publish At</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">Views</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">Total</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Modified</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                  Loading list...
                </td>
              </tr>
            ) : data && data.rows.length > 0 ? (
              data.rows.map((row) => (
                <tr key={row.fileName}>
                  <td className="px-3 py-2 font-mono text-xs text-gray-800">{row.slug}</td>
                  <td className="px-3 py-2 text-gray-900">{row.title}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        row.status === 'public'
                          ? 'rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800'
                          : row.status === 'scheduled'
                            ? 'rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'
                            : 'rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800'
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{formatDate(row.date)}</td>
                  <td className="px-3 py-2 text-gray-700">{formatLocal(row.publishAt)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-900">{row.views.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-900">{row.totalViews.toLocaleString()}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{formatLocal(row.lastModified)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={row.path}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        className="rounded border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => {
                          void handleDelete(row);
                        }}
                        disabled={Boolean(deletingFileName)}
                      >
                        {deletingFileName === row.fileName ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

