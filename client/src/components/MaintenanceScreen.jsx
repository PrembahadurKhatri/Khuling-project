// Shown in place of the public site when Settings.maintenanceMode is on
// (toggled in /admin/settings). Admin routes are untouched — this only
// wraps MainLayout, so /admin/* keeps working so the toggle can be flipped
// back off.
const MaintenanceScreen = ({ companyName }) => (
  <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)] px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />

    <div className="relative max-w-md">
      <img src="/logo.png" alt={companyName} className="h-14 w-14 mx-auto mb-6" />
      <p className="eyebrow-invert mb-4">Be Right Back</p>
      <h1 className="font-body font-bold text-2xl md:text-3xl text-stone mb-4 leading-tight">
        We're currently down for scheduled maintenance.
      </h1>
      <p className="text-stone/70 text-[15px] leading-relaxed">
        We're making some improvements and will be back online shortly. Thank you for your patience.
      </p>
    </div>
  </div>
);

export default MaintenanceScreen;
