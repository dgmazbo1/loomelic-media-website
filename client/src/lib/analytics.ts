/**
 * GA4 Analytics Utility
 * Fires gtag events for conversion tracking.
 * The gtag function is injected globally via index.html.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fire a GA4 event. Safe to call even if gtag is not loaded.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params ?? {});
  }
}

/**
 * Track a "Book a Call" CTA click as a GA4 conversion.
 * @param source - Where the button was clicked (e.g. "navbar", "hero", "stats", "about")
 */
export function trackBookACall(source: string) {
  trackEvent("book_a_call_click", {
    event_category: "conversion",
    event_label: source,
    value: 1,
  });
}
