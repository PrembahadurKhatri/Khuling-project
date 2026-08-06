import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService.js";

// Categories feed the dropdown on both Projects and Services (see
// ProjectsManage.jsx / ServicesManage.jsx) — a Service's category links it to
// the matching /projects?category=<name> filter via the public "Related
// Projects" button (see pages/Services.jsx).
const CategoriesManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
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

  const createMutation = useMutation({ mutationFn: createCategory, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => updateCategory(id, name),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteCategory, onSuccess: invalidate });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

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

  const saveEdit = async (id) => {
    if (!editingName.trim()) return;
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Categories</h1>
      </div>
      <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Shared by Projects and Services. A Service's category links it to a matching Projects filter via the public "Related Projects" button.
      </p>

      <form onSubmit={handleCreate} className="flex gap-3 mb-6 max-w-md">
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <button type="submit" className="btn-primary !py-2 shrink-0">+ Add</button>
      </form>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border max-w-md ${panelClass}`}>
          {data?.data?.length ? (
            data.data.map((category) => (
              <div key={category._id} className={`flex items-center justify-between px-4 py-3 border-t first:border-t-0 ${rowClass}`}>
                {editingId === category._id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveEdit(category._id)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(category._id)}
                    className={inputClass}
                  />
                ) : (
                  <span>{category.name}</span>
                )}
                {editingId !== category._id && (
                  <div className="space-x-3 shrink-0 ml-3">
                    <button onClick={() => startEdit(category)} className="text-primary hover:underline text-sm">Rename</button>
                    <button onClick={() => handleDelete(category._id)} className="text-red-400 hover:underline text-sm">Delete</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={`p-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No categories yet. Add the first one above.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesManage;
