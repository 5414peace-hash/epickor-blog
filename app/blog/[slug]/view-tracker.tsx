'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

function getTodayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    if (!slug) return;

    const day = getTodayUtc();
    const key = `epickor:view:${slug}:${day}`;
    try {
      if (window.localStorage.getItem(key) === '1') {
        return;
      }
    } catch (_e) {
      // Ignore localStorage failures and continue with best effort.
    }

    const track = async () => {
      try {
        await fetch('/api/studio/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
          keepalive: true,
        });
        try {
          window.localStorage.setItem(key, '1');
        } catch (_e) {
          // Ignore localStorage failures.
        }
      } catch (_error) {
        // Best effort tracking only.
      }
    };

    void track();
  }, [slug]);

  return null;
}

