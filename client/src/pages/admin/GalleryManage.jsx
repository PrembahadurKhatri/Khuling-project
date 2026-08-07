import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  fetchGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../../services/galleryService.js";

const emptyForm = { caption: "", category: "", image: null };

const GalleryManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => fetchGallery(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });

  const createMutation = useMutation({ mutationFn: createGalleryImage, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateGalleryImage(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteGalleryImage, onSuccess: invalidate });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ caption: item.caption || "", category: item.category || "", image: null });
    setPreview(item.image || null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload: form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this image? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-body font-bold">Gallery</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ Upload Image</button>
      </div>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`rounded-xl border p-4 ${panelClass}`}>
          {data?.data?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.data.map((item) => (
                <div key={item._id} className="group relative rounded-lg overflow-hidden border border-line dark:border-gray-800">
                  <img src={item.image} alt={item.caption || "Gallery"} className="h-32 w-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                    {item.caption && <p className="text-xs text-white line-clamp-2">{item.caption}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(item)} className="text-xs text-teal hover:underline">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>No images yet. Upload the first one.</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleSubmit} className={`w-full max-w-md space-y-3 rounded-xl border p-6 ${panelClass}`}>
            <h2 className="font-heading font-semibold text-lg mb-2">
              {editing ? "Edit Image" : "Upload Image"}
            </h2>

            <div>
              {preview && <img src={preview} alt="Preview" className="h-40 w-full object-cover rounded-lg mb-2" />}
              <input type="file" accept="image/*" onChange={handleFileChange} className={inputClass} required={!editing} />
            </div>

            <input placeholder="Caption (optional)" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className={inputClass} />
            <input placeholder="Category (optional, e.g. Site Progress)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary !py-2">
                {editing ? "Save Changes" : "Upload"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GalleryManage;
