import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../services/settingsService.js";

// Same fallback text index.html ships statically, so there's no flash of
// different content between the pre-JS HTML and the first React render.
const DEFAULT_TITLE = "Khilung Kalika Construction Pvt. Ltd.";
const DEFAULT_DESCRIPTION = "Premium construction, infrastructure, and engineering services.";

/**
 * Site-wide SEO/Analytics config, sourced from Settings -> SEO (admin
 * panel). Reuses the "public-settings" query key already fetched by
 * MainLayout/Footer/WhatsAppButton, so this never costs an extra request —
 * React Query just serves it from cache.
 */
export default function useSiteSeo() {
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data || {};
  const seo = settings.seo || {};

  return {
    siteName: settings.companyName || DEFAULT_TITLE,
    defaultTitle: seo.metaTitle || settings.companyName || DEFAULT_TITLE,
    defaultDescription: seo.metaDescription || settings.tagline || DEFAULT_DESCRIPTION,
    googleAnalyticsId: seo.googleAnalyticsId || "",
    googleSiteVerification: seo.googleSiteVerification || "",
  };
}
