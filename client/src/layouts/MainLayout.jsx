import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { fetchSettings } from "../services/settingsService.js";
import useTrackVisit from "../hooks/useTrackVisit.js";
import useSiteSeo from "../hooks/useSiteSeo.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import MaintenanceScreen from "../components/MaintenanceScreen.jsx";
import Seo from "../components/Seo.jsx";
import GoogleAnalytics from "../components/GoogleAnalytics.jsx";

const MainLayout = () => {
  useTrackVisit();

  // Shared cache key with WhatsAppButton's own settings fetch, so this
  // doesn't cost a second request.
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data;
  const { googleAnalyticsId, googleSiteVerification } = useSiteSeo();

  // Only block once we've actually confirmed maintenance mode is on — never
  // flash the maintenance screen while settings are still loading.
  if (settings?.maintenanceMode) {
    return <MaintenanceScreen companyName={settings.companyName} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Site-wide defaults — each page renders its own <Seo> further down
          the tree, which react-helmet-async merges over this one (deepest/
          last wins), so pages that forget to set their own title/description
          still get sensible ones instead of falling through to nothing. */}
      <Seo />
      {googleSiteVerification && (
        <Helmet>
          <meta name="google-site-verification" content={googleSiteVerification} />
        </Helmet>
      )}
      <GoogleAnalytics measurementId={googleAnalyticsId} />

      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
