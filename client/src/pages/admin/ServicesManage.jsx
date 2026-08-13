import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchServices, createService, updateService, deleteService } from "../../services/serviceService.js";
import { fetchCategories } from "../../services/categoryService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";
import useToast from "../../hooks/useToast.js";

const emptyForm = {
  title: "", category: "", shortDescription: "", description: "", benefits: "",
  heroImage: "", heroImageFile: null,
};

// Service.benefits is an array in the schema; the form edits it as one
// benefit per line and converts on submit/load.
const toFormBenefits = (benefits) => (benefits || []).join("\n");
const toPayloadBenefits = (text) =>
  text.split("\n").map((b) => b.trim()).filter(Boolean);

const ServicesManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => fetchServices(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const categories = categoriesData?.data || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-services"] });
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => { invalidate(); toast.success("Service created."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: () => { invalidate(); toast.success("Service updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => { invalidate(); toast.success("Service deleted."); },
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

  const openEdit = (service) => {
    setEditing(service);
    setForm({ ...emptyForm, ...service, benefits: toFormBenefits(service.benefits), heroImageFile: null });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { heroImageFile, ...rest } = form;
    const payload = {
      ...rest,
      benefits: toPayloadBenefits(form.benefits),
      heroImage: heroImageFile || form.heroImage,
    };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this service? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Services</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Service</button>
      </div>

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
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Short Description</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No services yet.
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((service) => (
                    <tr key={service._id} className={`border-t ${rowClass}`}>
                      <td className="px-4 py-3">
                        {service.heroImage ? (
                          <img src={service.heroImage} alt={service.title} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className={`h-10 w-10 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                        )}
                      </td>
                      <td className="px-4 py-3">{service.title}</td>
                      <td className="px-4 py-3">{service.category || "—"}</td>
                      <td className="max-w-sm truncate px-4 py-3">{service.shortDescription}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => openEdit(service)} className="text-primary hover:underline">Edit</button>
                        <button onClick={() => handleDelete(service._id)} className="text-red-400 hover:underline">Delete</button>
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
                No services yet.
              </div>
            )}
            {data?.data?.map((service) => (
              <div key={service._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start gap-3">
                  {service.heroImage ? (
                    <img src={service.heroImage} alt={service.title} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className={`h-14 w-14 shrink-0 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{service.title}</div>
                    <div className={`mt-0.5 truncate text-xs ${mutedClass}`}>
                      {service.category || "No linked category"}
                    </div>
                    {service.shortDescription && (
                      <p className={`mt-1.5 line-clamp-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-ink"}`}>
                        {service.shortDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                  <button onClick={() => openEdit(service)} className={ghostBtnClass}>Edit</button>
                  <button onClick={() => handleDelete(service._id)} className={dangerBtnClass}>Delete</button>
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
            <h2 className="mb-2 font-heading text-lg font-semibold">{editing ? "Edit Service" : "New Service"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>
                Related project category (optional)
              </label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <p className={`mt-1 text-xs ${mutedClass}`}>
                Powers the "Related Projects" button on the public Services page — links to Projects filtered by this category.
              </p>
            </div>

            <ImageSourceField
              theme={theme}
              label="Image"
              urlValue={form.heroImage}
              fileValue={form.heroImageFile}
              onUrlChange={(v) => setForm((prev) => ({ ...prev, heroImage: v }))}
              onFileChange={(f) => setForm((prev) => ({ ...prev, heroImageFile: f }))}
            />

            <input placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className={inputClass} />
            <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
            <textarea placeholder="Benefits (one per line)" rows={4} value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} className={inputClass} />

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">{editing ? "Save Changes" : "Create Service"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServicesManage;