import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  schema?: object | object[];
}

const SITE_NAME = "Loomelic Media";
const BASE_URL = "https://loomelicmedia.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * useSEO — sets per-page meta tags dynamically.
 * Call at the top of each page component.
 */
export function useSEO({
  title,
  description,
  ogImage,
  canonical,
  noindex = false,
  schema,
}: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Dealer Content Systems | Las Vegas, NV`;
    const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    const ogImg = ogImage || DEFAULT_OG_IMAGE;

    // Title
    document.title = fullTitle;

    // Helper to set/create meta
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrVal] = selector.replace("meta[", "").replace("]", "").split('="');
        el.setAttribute(attrName.replace(/"/g, ""), attrVal?.replace(/"/g, "") || "");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Helper to set/create link
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[property="og:url"]', "content", fullCanonical);
    setMeta('meta[property="og:image"]', "content", ogImg);
    setMeta('meta[name="twitter:image"]', "content", ogImg);
    setLink("canonical", fullCanonical);

    if (noindex) {
      setMeta('meta[name="robots"]', "content", "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "content", "index, follow");
    }

    // Inject page-level schema
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      // Remove existing page-level schemas (not the base LocalBusiness one)
      document.querySelectorAll('script[type="application/ld+json"][data-page]').forEach(el => el.remove());
      schemas.forEach((s, i) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-page", String(i));
        script.textContent = JSON.stringify(s);
        document.head.appendChild(script);
      });
    }

    // Cleanup page schemas on unmount
    return () => {
      document.querySelectorAll('script[type="application/ld+json"][data-page]').forEach(el => el.remove());
    };
  }, [title, description, ogImage, canonical, noindex]);
}
