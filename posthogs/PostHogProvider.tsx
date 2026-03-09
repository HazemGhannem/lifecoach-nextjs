'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    enable_heatmaps: true,
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog) return;
    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    if (prevPathname.current !== pathname) {
      posthog.capture('$pageview', { $current_url: url });
      prevPathname.current = pathname;
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY!} >
      <PageViewTracker />
      {children}
    </PHProvider>
  );
}
