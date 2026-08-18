import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/**
 * Loads gtag.js and tracks pageviews — only when Settings -> SEO ->
 * Google Analytics ID is actually configured; renders nothing otherwise.
 *
 * The gtag() bootstrap call runs from this component's own effect (part of
 * the app's trusted 'self' bundle), not an inline <script> tag, so the
 * server's CSP only needs to allow the googletagmanager.com *script src*
 * (see server.js) — no 'unsafe-inline' required.
 *
 * SPA note: gtag's automatic pageview only fires on a real page load, which
 * never happens again after the first one in a client-routed app, so this
 * disables that and fires page_view manually on every route change instead.
 */
export default function GoogleAnalytics({ measurementId }) {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId) return;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || !window.gtag) return;
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementId, location.pathname, location.search]);

  if (!measurementId) return null;

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
    </Helmet>
  );
}
