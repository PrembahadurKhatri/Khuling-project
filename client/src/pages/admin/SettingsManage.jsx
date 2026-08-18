import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, useNavigate } from "react-router-dom";
import { fetchSettings, updateSettings } from "../../services/settingsService.js";
import { changePassword } from "../../services/authService.js";
import useToast from "../../hooks/useToast.js";
import useAuth from "../../hooks/useAuth.js";

const emptyForm = {
  companyName: "",
  tagline: "",
  email: "",
  phone: "",
  emergencyContact: "",
  address: "",
  mapEmbedUrl: "",
  credentials: [],
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", twitter: "" },
  stats: { projectsCompleted: 0, yearsExperience: 0, clientsServed: 0, engineers: 0, machines: 0 },
  seo: { metaTitle: "", metaDescription: "" },
  maintenanceMode: false,
};

const emptyPasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const SettingsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [changingPassword, setChangingPassword] = useState(false);

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
      toast?.success("Settings saved.");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      toast?.error(err.response?.data?.message || "Failed to save settings.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (group, key, value) => setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));

  const setCredential = (index, value) =>
    setForm((f) => ({ ...f, credentials: f.credentials.map((c, i) => (i === index ? value : c)) }));
  const addCredential = () => setForm((f) => ({ ...f, credentials: [...f.credentials, ""] }));
  const removeCredential = (index) => setForm((f) => ({ ...f, credentials: f.credentials.filter((_, i) => i !== index) }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      toast?.error("New password must be at least 8 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast?.error("New password and confirmation don't match.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast?.success("Password changed. Please log in again.");
      setPasswordForm(emptyPasswordForm);
      setTimeout(async () => {
        await logout();
        navigate("/admin/login");
      }, 1500);
    } catch (err) {
      toast?.error(err.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

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
        <h1 className="text-2xl font-body font-bold">Site Settings</h1>
        {saved && <span className="text-sm text-green-500">Saved</span>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-body font-semibold mb-1">Company Info</h2>
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
              <span className={`block text-[11px] ${labelClass}`}>
                From Google Maps: Share → Embed a map → Copy HTML. Pasting either the full &lt;iframe&gt; code or just its src URL both work.
              </span>
            </label>
          </div>
        </section>

        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-body font-semibold mb-1">Credibility Strip (Homepage)</h2>
          <p className={`text-xs ${labelClass}`}>Short badges shown right below the hero — e.g. "ISO 9001:2015 Certified".</p>
          <div className="space-y-2">
            {form.credentials.map((credential, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputClass} value={credential} onChange={(e) => setCredential(i, e.target.value)} placeholder="e.g. 120+ Projects Delivered" />
                <button
                  type="button"
                  onClick={() => removeCredential(i)}
                  className={`shrink-0 rounded-lg border px-3 text-sm ${theme === "dark" ? "border-gray-700 text-gray-400 hover:text-red-400" : "border-line text-gray-500 hover:text-red-500"}`}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCredential}
            className={`text-sm font-semibold ${theme === "dark" ? "text-gold" : "text-navy"} hover:underline`}
          >
            + Add credential
          </button>
        </section>

        <section className={`rounded-xl border p-6 space-y-3 ${panelClass}`}>
          <h2 className="font-body font-semibold mb-1">Social Links</h2>
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
          <h2 className="font-body font-semibold mb-1">Homepage Stats</h2>
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
          <h2 className="font-body font-semibold mb-1">SEO</h2>
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
            <h2 className="font-body font-semibold">Maintenance mode</h2>
            <p className={`text-xs ${labelClass}`}>When on, visitors see a "back soon" screen instead of the site. Admin login still works.</p>
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

      <form onSubmit={handleChangePassword} className={`mt-8 max-w-3xl space-y-3 rounded-xl border p-6 ${panelClass}`}>
        <h2 className="font-body font-semibold mb-1">Change Password</h2>
        <p className={`text-xs mb-2 ${labelClass}`}>You'll be logged out and need to sign in again after changing it.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="space-y-1">
            <span className={`text-xs ${labelClass}`}>Current password</span>
            <input
              type="password"
              required
              className={inputClass}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </label>
          <label className="space-y-1">
            <span className={`text-xs ${labelClass}`}>New password</span>
            <input
              type="password"
              required
              minLength={8}
              className={inputClass}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </label>
          <label className="space-y-1">
            <span className={`text-xs ${labelClass}`}>Confirm new password</span>
            <input
              type="password"
              required
              minLength={8}
              className={inputClass}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </label>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={changingPassword} className="btn-primary !py-2">
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManage;
