import { Helmet } from "react-helmet-async";
import useSiteSeo from "../hooks/useSiteSeo.js";

/**
 * Per-page <title>, meta description, canonical link, and Open Graph /
 * Twitter card tags. Every public page renders one of these with its own
 * title/description; anything that doesn't (or is still loading) falls
 * back to the site-wide defaults from Settings -> SEO.
 *
 * Pass `noindex` for pages that should never appear in search results
 * (admin panel, 404) — also belt-and-braces alongside robots.txt's
 * Disallow: /admin, in case a stray admin URL ever gets linked externally.
 */
export default function Seo({ title, description, image, noindex = false }) {
  const { siteName, defaultTitle, defaultDescription } = useSiteSeo();

  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const url = typeof window !== "undefined" ? window.location.href : undefined;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
