import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchSettings, updateSettings } from "../../services/settingsService.js";

const emptyForm = {
  companyName: "",
  tagline: "",
  email: "",
  phone: "",
  emergencyContact: "",
  address: "",
  mapEmbedUrl: "",
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", twitter: "" },
  stats: { projectsCompleted: 0, yearsExperience: 0, clientsServed: 0, engineers: 0, machines: 0 },
  seo: { metaTitle: "", metaDescription: "" },
  maintenanceMode: false,
};

const SettingsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: fetchSettings });

  useEffect(() => {
    if (data?.data) {
      setForm({
        ...emptyForm,
        ...data.data,
        social: { ...emptyForm.social, ...data.data.social },
        stats: { ...emptyForm.stats, ...data.data.stats },
        seo: { ...emptyForm.seo, ...data.data.seo },
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (group, key, value) => setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const labelClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

  if (isLoading) {
    return <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Site Settings</h1>
        {saved && <span className="text-sm text-green-500">Saved</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-heading font-semibold mb-1">Company Info</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Company name</span>
              <input className={inputClass} value={form.companyName} onChange={(e) => setField("companyName", e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Tagline</span>
              <input className={inputClass} value={form.tagline} onChange={(e) => setField("tagline", e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Email</span>
              <input className={inputClass} value={form.email} onChange={(e) => setField("email", e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Phone</span>
              <input className={inputClass} value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Emergency contact</span>
              <input className={inputClass} value={form.emergencyContact} onChange={(e) => setField("emergencyContact", e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Address</span>
              <input className={inputClass} value={form.address} onChange={(e) => setField("address", e.target.value)} />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className={`text-xs ${labelClass}`}>Google Maps embed URL</span>
              <input className={inputClass} value={form.mapEmbedUrl} onChange={(e) => setField("mapEmbedUrl", e.target.value)} />
            </label>
          </div>
        </section>

        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-heading font-semibold mb-1">Social Links</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {["facebook", "instagram", "linkedin", "youtube", "twitter"].map((key) => (
              <label key={key} className="space-y-1">
                <span className={`text-xs capitalize ${labelClass}`}>{key}</span>
                <input className={inputClass} value={form.social[key]} onChange={(e) => setNested("social", key, e.target.value)} />
              </label>
            ))}
          </div>
        </section>

        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-heading font-semibold mb-1">Homepage Stats</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ["projectsCompleted", "Projects completed"],
              ["yearsExperience", "Years experience"],
              ["clientsServed", "Clients served"],
              ["engineers", "Engineers"],
              ["machines", "Machines"],
            ].map(([key, label]) => (
              <label key={key} className="space-y-1">
                <span className={`text-xs ${labelClass}`}>{label}</span>
                <input
                  type="number"
                  className={inputClass}
                  value={form.stats[key]}
                  onChange={(e) => setNested("stats", key, Number(e.target.value))}
                />
              </label>
            ))}
          </div>
        </section>

        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-heading font-semibold mb-1">SEO</h2>
          <div className="grid gap-3">
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Meta title</span>
              <input className={inputClass} value={form.seo.metaTitle} onChange={(e) => setNested("seo", "metaTitle", e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Meta description</span>
              <textarea rows={2} className={inputClass} value={form.seo.metaDescription} onChange={(e) => setNested("seo", "metaDescription", e.target.value)} />
            </label>
          </div>
        </section>

        <section className={`rounded-xl border p-6 flex items-center justify-between ${panelClass}`}>
          <div>
            <h2 className="font-heading font-semibold">Maintenance mode</h2>
            <p className={`text-xs ${labelClass}`}>Reserved for future use — not yet enforced by the public site.</p>
          </div>
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={form.maintenanceMode}
            onChange={(e) => setField("maintenanceMode", e.target.checked)}
          />
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="btn-primary !py-2">
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManage;
