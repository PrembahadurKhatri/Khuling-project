import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../services/settingsService.js";
import useTrackVisit from "../hooks/useTrackVisit.js";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import MaintenanceScreen from "../components/MaintenanceScreen.jsx";

const MainLayout = () => {
  useTrackVisit();

  // Shared cache key with WhatsAppButton's own settings fetch, so this
  // doesn't cost a second request.
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data;

  // Only block once we've actually confirmed maintenance mode is on — never
  // flash the maintenance screen while settings are still loading.
  if (settings?.maintenanceMode) {
    return <MaintenanceScreen companyName={settings.companyName} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
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
