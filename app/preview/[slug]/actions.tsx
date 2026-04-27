'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PreviewActionsProps {
  slug: string;
  token: string;
}

export default function PreviewActions({ slug, token }: PreviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [message, setMessage] = useState('');

  async function handleApprove() {
    setLoading('approve');
    setMessage('');
    try {
      const res = await fetch('/api/preview/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, token }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Approved. The public post should be available after the next deployment.');
        setTimeout(() => router.push(`/blog/${slug}`), 3000);
      } else {
        setMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    if (!confirm('Delete this draft from GitHub? This cannot be undone.')) return;
    setLoading('reject');
    setMessage('');
    try {
      const res = await fetch('/api/preview/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, token }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Rejected. Returning to home...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
            Preview mode
          </span>
          {message && (
            <span className="text-sm text-gray-700">{message}</span>
          )}
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={handleReject}
            disabled={loading !== null}
            className="rounded-lg border border-red-300 bg-white px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {loading === 'reject' ? 'Rejecting...' : 'Reject'}
          </button>
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading === 'approve' ? 'Approving...' : 'Approve and publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
