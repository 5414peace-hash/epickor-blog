'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AmazonProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  url: string;
  category: string;
  image: string;
}

const EMPTY_PRODUCT: AmazonProduct = {
  id: '',
  name: '',
  description: '',
  price: '',
  url: '',
  category: 'Shopping',
  image: '',
};

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

function nextId(products: AmazonProduct[]): string {
  const max = products.reduce((acc, item) => {
    const n = Number.parseInt(item.id, 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return String(max + 1).padStart(3, '0');
}

export default function StudioAmazonLinksPage() {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [draft, setDraft] = useState<AmazonProduct>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError('');
      setStatus('');

      try {
        const token = extractGithubTokenFromStorage();
        const response = await fetch('/api/studio/amazon-links', {
          cache: 'no-store',
          headers: token ? { 'x-github-token': token } : undefined,
        });
        const json = (await response.json()) as { products?: AmazonProduct[]; warning?: string; error?: string };
        if (!response.ok) {
          throw new Error(json.error || `Load failed (${response.status})`);
        }

        if (canceled) return;
        const list = Array.isArray(json.products) ? json.products : [];
        setProducts(list);
        setDraft((prev) => ({ ...prev, id: nextId(list) }));
        if (json.warning) {
          setStatus(`Warning: ${json.warning}`);
        }
      } catch (err) {
        if (canceled) return;
        setError(err instanceof Error ? err.message : 'Failed to load amazon links.');
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    void load();
    return () => {
      canceled = true;
    };
  }, []);

  const handleAdd = () => {
    if (!draft.name.trim() || !draft.url.trim()) {
      setError('Name and URL are required.');
      return;
    }
    const toAdd = {
      ...draft,
      id: draft.id.trim() || nextId(products),
    };
    const next = [...products, toAdd];
    setProducts(next);
    setDraft({
      ...EMPTY_PRODUCT,
      id: nextId(next),
    });
    setError('');
  };

  const handleRemove = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    setDraft((prev) => ({ ...prev, id: nextId(next) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setStatus('');
    try {
      const token = extractGithubTokenFromStorage();
      if (!token) {
        throw new Error('GitHub token not found. Login once in /admin, then retry.');
      }

      const response = await fetch('/api/studio/amazon-links', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-github-token': token,
        },
        body: JSON.stringify({ products }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string; count?: number };
      if (!response.ok || !json.ok) {
        throw new Error(json.error || `Save failed (${response.status})`);
      }

      setStatus(`Saved ${json.count || products.length} links.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Amazon Link</h1>
          <p className="mt-2 text-sm text-gray-600">Manage reusable Amazon links for blog insertion.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/studio" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Dashboard
          </Link>
          <Link href="/studio/new" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            New Blog
          </Link>
          <Link href="/studio/list" className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            List
          </Link>
        </div>
      </div>

      {status ? <div className="mb-4 rounded border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{status}</div> : null}
      {error ? <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Add Link</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="ID (optional)" value={draft.id} onChange={(e) => setDraft((p) => ({ ...p, id: e.target.value }))} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Name" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="URL" value={draft.url} onChange={(e) => setDraft((p) => ({ ...p, url: e.target.value }))} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Price" value={draft.price} onChange={(e) => setDraft((p) => ({ ...p, price: e.target.value }))} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Category" value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))} />
          <input className="rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Image URL (optional)" value={draft.image} onChange={(e) => setDraft((p) => ({ ...p, image: e.target.value }))} />
          <textarea className="md:col-span-2 rounded border border-gray-300 px-3 py-2 text-sm" placeholder="Description" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
        </div>
        <button type="button" className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={handleAdd}>
          Add Link
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Current Links ({products.length})</h2>
          <button
            type="button"
            className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60"
            onClick={() => void handleSave()}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-sm text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="py-8 text-sm text-gray-500">No links.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">URL</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((item) => (
                  <tr key={`${item.id}-${item.url}`}>
                    <td className="px-3 py-2 font-mono">{item.id}</td>
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2">{item.category}</td>
                    <td className="px-3 py-2">{item.price}</td>
                    <td className="px-3 py-2 max-w-[360px] truncate">{item.url}</td>
                    <td className="px-3 py-2">
                      <button type="button" className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50" onClick={() => handleRemove(item.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

