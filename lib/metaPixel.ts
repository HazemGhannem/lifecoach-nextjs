declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export const trackEvent = (event: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
};
