import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchServices, createService, updateService, deleteService } from "../../services/serviceService.js";
import { fetchCategories } from "../../services/categoryService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";

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

  const createMutation = useMutation({ mutationFn: createService, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateService(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteService, onSuccess: invalidate });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Services</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ New Service</button>
      </div>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panelClass}`}>
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
                  <td className="px-4 py-3 max-w-sm truncate">{service.shortDescription}</td>
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
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className={`w-full max-w-lg space-y-3 rounded-xl border p-6 my-8 ${panelClass}`}>
            <h2 className="font-heading font-semibold text-lg mb-2">{editing ? "Edit Service" : "New Service"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Related project category (optional)
              </label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
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

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" className="btn-primary !py-2">{editing ? "Save Changes" : "Create Service"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ServicesManage;
