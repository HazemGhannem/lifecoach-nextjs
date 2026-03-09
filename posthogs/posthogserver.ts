import { PostHog } from 'posthog-node';

// ── Server-side PostHog client ────────────────────────────────────────────────
// Use this in API routes and server components
const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
  flushAt: 1, // send immediately in serverless
  flushInterval: 0, // don't batch in serverless
});

export default posthogClient;

// ── Track server-side events ──────────────────────────────────────────────────
export async function trackServerEvent(
  userId: string,
  event: string,
  properties?: Record<string, any>,
) {
  posthogClient.capture({
    distinctId: userId,
    event,
    properties,
  });

  await posthogClient.flush(); // wait for event to be sent
}
