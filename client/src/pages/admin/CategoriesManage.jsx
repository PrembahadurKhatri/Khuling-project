import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService.js";
import useToast from "../../hooks/useToast.js";

// Categories feed the dropdown on both Projects and Services (see
// ProjectsManage.jsx / ServicesManage.jsx) — a Service's category links it to
// the matching /projects?category=<name> filter via the public "Related
// Projects" button (see pages/Services.jsx).
const CategoriesManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { invalidate(); toast.success("Category added."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => updateCategory(id, name),
    onSuccess: () => { invalidate(); toast.success("Category renamed."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { invalidate(); toast.success("Category deleted."); },
    onError,
  });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const mutedClass = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";
  const iconBtnClass = theme === "dark"
    ? "rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-300 active:bg-gray-800"
    : "rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 active:bg-stone";

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createMutation.mutateAsync(name.trim());
    setName("");
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      cancelEdit();
      return;
    }
    await updateMutation.mutateAsync({ id, name: editingName.trim() });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this category? Projects/Services already using it will keep the old value as plain text.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-body font-bold">Categories</h1>
      </div>
      <p className={`mb-6 text-sm ${mutedClass}`}>
        Shared by Projects and Services. A Service's category links it to a matching Projects filter via the public "Related Projects" button.
      </p>

      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 sm:max-w-md sm:flex-row sm:gap-3">
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputClass} !py-2.5`}
        />
        <button type="submit" className="btn-primary w-full shrink-0 !py-2.5 sm:w-auto sm:!py-2">+ Add</button>
      </form>

      {isLoading ? (
        <p className={mutedClass}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border sm:max-w-md ${panelClass}`}>
          {data?.data?.length ? (
            data.data.map((category) => (
              <div key={category._id} className={`border-t px-4 py-3.5 first:border-t-0 ${rowClass}`}>
                {editingId === category._id ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(category._id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className={`${inputClass} !py-2`}
                    />
                    <div className="flex shrink-0 justify-end gap-2">
                      <button onClick={cancelEdit} className={`${iconBtnClass} flex-1 sm:flex-none`}>Cancel</button>
                      <button onClick={() => saveEdit(category._id)} className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white active:opacity-90 sm:flex-none">Save</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 truncate">{category.name}</span>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => startEdit(category)} className={iconBtnClass}>Rename</button>
                      <button onClick={() => handleDelete(category._id)} className={`${iconBtnClass} text-red-400`}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={`p-4 ${mutedClass}`}>No categories yet. Add the first one above.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesManage;