import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchDesigns, createDesign, updateDesign, deleteDesign } from "../../services/designService.js";
import MultiImageField from "../../components/admin/MultiImageField.jsx";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";
import useToast from "../../hooks/useToast.js";

const emptyForm = {
  name: "", category: "", description: "", order: 0,
  existingImages: [], imageFiles: [],
  videos: [],
  existingDpr: "", dprFile: null,
};

const DesignManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-designs"],
    queryFn: fetchDesigns,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-designs"] });
    queryClient.invalidateQueries({ queryKey: ["designs"] });
  };
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createDesign,
    onSuccess: () => { invalidate(); toast.success("Design added."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateDesign(id, payload),
    onSuccess: () => { invalidate(); toast.success("Design updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteDesign,
    onSuccess: () => { invalidate(); toast.success("Design removed."); },
    onError,
  });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const cardClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const mutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";
  const ghostBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-gray-800 text-sm font-medium text-gray-100 active:bg-gray-700"
    : "flex-1 min-h-[40px] rounded-lg bg-stone text-sm font-medium text-ink active:bg-line";
  const dangerBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-red-950/40 text-sm font-medium text-red-400 active:bg-red-950/60"
    : "flex-1 min-h-[40px] rounded-lg bg-red-50 text-sm font-medium text-red-500 active:bg-red-100";

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...emptyForm,
      ...item,
      existingImages: item.images || [],
      imageFiles: [],
      videos: item.videos || [],
      existingDpr: item.dpr || "",
      dprFile: null,
    });
    setShowForm(true);
  };

  const addVideo = () => setForm((f) => ({ ...f, videos: [...f.videos, ""] }));
  const setVideo = (i, value) => setForm((f) => ({ ...f, videos: f.videos.map((v, idx) => (idx === i ? value : v)) }));
  const removeVideo = (i) => setForm((f) => ({ ...f, videos: f.videos.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = form;
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this design? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Design</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Design</button>
      </div>
      <p className={`text-sm -mt-4 mb-6 max-w-2xl ${mutedClass}`}>
        Shown on the public Design page (Services → Design) — one entry per design sample or discipline.
      </p>

      {isLoading ? (
        <p className={mutedClass}>Loading...</p>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className={`hidden overflow-hidden rounded-xl border md:block ${panelClass}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className={`${tableHeaderClass} text-left`}>
                  <tr>
                    <th className="px-4 py-3">Image</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={4} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No designs yet.
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((item) => (
                    <tr key={item._id} className={`border-t ${rowClass}`}>
                      <td className="px-4 py-3">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className={`h-10 w-10 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                        )}
                      </td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">
                        {item.category || "—"}
                        {item.images?.length > 1 && <span className={`ml-2 text-xs ${mutedClass}`}>+{item.images.length - 1} more</span>}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => openEdit(item)} className="text-primary hover:underline">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {data?.data?.length === 0 && (
              <div className={`rounded-xl border px-4 py-8 text-center text-sm ${cardClass} ${mutedClass}`}>
                No designs yet.
              </div>
            )}
            {data?.data?.map((item) => (
              <div key={item._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start gap-3">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className={`h-14 w-14 shrink-0 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{item.name}</div>
                    <div className={`mt-0.5 truncate text-xs ${mutedClass}`}>
                      {item.category || "No category"}
                      {item.images?.length > 1 && ` · +${item.images.length - 1} more`}
                    </div>
                  </div>
                </div>
                <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                  <button onClick={() => openEdit(item)} className={ghostBtnClass}>Edit</button>
                  <button onClick={() => handleDelete(item._id)} className={dangerBtnClass}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-black/60 sm:items-center sm:p-4">
          <form
            onSubmit={handleSubmit}
            className={`my-0 max-h-[92vh] w-full space-y-3 overflow-y-auto rounded-t-2xl border p-6 sm:my-8 sm:max-w-lg sm:rounded-2xl ${panelClass}`}
          >
            <h2 className="mb-2 font-heading text-lg font-semibold">{editing ? "Edit Design" : "New Design"}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input required placeholder="Name (e.g. Hospital Block Design)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              <input placeholder="Category (e.g. Architectural Design)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
            </div>

            <MultiImageField
              theme={theme}
              label="Images"
              urls={form.existingImages}
              files={form.imageFiles}
              onUrlsChange={(urls) => setForm((prev) => ({ ...prev, existingImages: urls }))}
              onFilesChange={(files) => setForm((prev) => ({ ...prev, imageFiles: files }))}
              max={10}
            />

            <textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>Videos (optional — YouTube/Vimeo links)</label>
              <div className="space-y-2">
                {form.videos.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="https://youtube.com/watch?v=..."
                      value={v}
                      onChange={(e) => setVideo(i, e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeVideo(i)}
                      className={`shrink-0 rounded-lg border px-3 text-sm ${theme === "dark" ? "border-gray-700 text-gray-400 hover:text-red-400" : "border-line text-gray-500 hover:text-red-500"}`}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addVideo} className={`mt-2 text-sm font-semibold ${theme === "dark" ? "text-gold" : "text-navy"} hover:underline`}>
                + Add video link
              </button>
            </div>

            <ImageSourceField
              theme={theme}
              label="DPR (Detailed Project Report)"
              accept="application/pdf,.doc,.docx"
              isDocument
              urlValue={form.existingDpr}
              fileValue={form.dprFile}
              onUrlChange={(v) => setForm((prev) => ({ ...prev, existingDpr: v }))}
              onFileChange={(f) => setForm((prev) => ({ ...prev, dprFile: f }))}
            />

            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Display order (lower shows first)</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className={inputClass}
              />
            </label>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">
                {createMutation.isPending || updateMutation.isPending ? "Uploading..." : editing ? "Save Changes" : "Create Design"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DesignManage;
