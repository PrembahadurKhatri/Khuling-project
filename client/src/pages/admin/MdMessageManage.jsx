import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchMdMessage, updateMdMessage } from "../../services/mdMessageService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";
import useToast from "../../hooks/useToast.js";
import getErrorMessage from "../../utils/getErrorMessage.js";

const emptyForm = { name: "", designation: "", message: "", photo: "", photoFile: null };

const MdMessageManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["admin-md-message"], queryFn: fetchMdMessage });

  useEffect(() => {
    if (data?.data) {
      setForm({ ...emptyForm, ...data.data, photoFile: null });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateMdMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-md-message"] });
      setSaved(true);
      toast?.success("MD/CEO message saved.");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      toast?.error(getErrorMessage(err, "Failed to save the MD/CEO message."));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { photoFile, ...rest } = form;
    const payload = { ...rest, photo: photoFile || form.photo };
    mutation.mutate(payload);
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

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
        <h1 className="text-2xl font-body font-bold">MD/CEO Message</h1>
        {saved && <span className="text-sm text-green-500">Saved</span>}
      </div>
      <p className={`text-sm mb-6 max-w-2xl ${labelClass}`}>
        Shown as a featured message section on the homepage. Leave the message empty to hide the section from the
        public site.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <section className={`rounded-xl border p-6 space-y-4 ${panelClass}`}>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Name</span>
              <input className={inputClass} value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="e.g. Ramesh Khilung" />
            </label>
            <label className="space-y-1">
              <span className={`text-xs ${labelClass}`}>Post / Designation</span>
              <input className={inputClass} value={form.designation} onChange={(e) => setField("designation", e.target.value)} placeholder="e.g. Managing Director" />
            </label>
          </div>

          <label className="space-y-1 block">
            <span className={`text-xs ${labelClass}`}>Message</span>
            <textarea
              rows={6}
              className={inputClass}
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              placeholder="A short message from the MD/CEO for the homepage..."
            />
          </label>

          <ImageSourceField
            theme={theme}
            label="Photo"
            urlValue={form.photo}
            fileValue={form.photoFile}
            onUrlChange={(v) => setField("photo", v)}
            onFileChange={(f) => setField("photoFile", f)}
          />
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="btn-primary !py-2">
            {mutation.isPending ? "Saving..." : "Save Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MdMessageManage;
