'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID } from '@/lib/analytics-config';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function toSnakeCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
}

function buildEventParams(element: HTMLElement): Record<string, string> {
  const params: Record<string, string> = {};

  Object.entries(element.dataset).forEach(([key, value]) => {
    if (!key.startsWith('analytics') || key === 'analyticsEvent' || !value) return;
    params[toSnakeCase(key.replace(/^analytics/, ''))] = value;
  });

  return params;
}

export default function AnalyticsEvents() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const element = target?.closest<HTMLElement>('[data-analytics-event]');
      const eventName = element?.dataset.analyticsEvent;

      if (!eventName || !window.gtag) return;

      window.gtag('event', eventName, buildEventParams(element));
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
