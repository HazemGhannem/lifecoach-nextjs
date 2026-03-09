'use client';

import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';

// ── Custom hook for tracking events ──────────────────────────────────────────
export function useAnalytics() {
  const posthog = usePostHog();

  // ── Track any custom event ────────────────────────────────────────────────
  const track = useCallback(
    (event: string, properties?: Record<string, any>) => {
      posthog?.capture(event, properties);
    },
    [posthog],
  );

  // ── Identify user after login ─────────────────────────────────────────────
  const identify = useCallback(
    (userId: string, properties?: Record<string, any>) => {
      posthog?.identify(userId, properties);
    },
    [posthog],
  );

  // ── Reset on logout ───────────────────────────────────────────────────────
  const reset = useCallback(() => {
    posthog?.reset();
  }, [posthog]);

  // ── Track button clicks ───────────────────────────────────────────────────
  const trackClick = useCallback(
    (buttonName: string, properties?: Record<string, any>) => {
      posthog?.capture('button_clicked', {
        button_name: buttonName,
        ...properties,
      });
    },
    [posthog],
  );

  // ── Track form submissions ────────────────────────────────────────────────
  const trackForm = useCallback(
    (formName: string, properties?: Record<string, any>) => {
      posthog?.capture('form_submitted', {
        form_name: formName,
        ...properties,
      });
    },
    [posthog],
  );

  // ── Track errors ──────────────────────────────────────────────────────────
  const trackError = useCallback(
    (errorName: string, properties?: Record<string, any>) => {
      posthog?.capture('error_occurred', {
        error_name: errorName,
        ...properties,
      });
    },
    [posthog],
  );

  // ── Track purchases / conversions ─────────────────────────────────────────
  const trackPurchase = useCallback(
    (amount: number, currency: string, properties?: Record<string, any>) => {
      posthog?.capture('purchase_completed', {
        amount,
        currency,
        ...properties,
      });
    },
    [posthog],
  );

  return {
    track,
    identify,
    reset,
    trackClick,
    trackForm,
    trackError,
    trackPurchase,
  };
}
