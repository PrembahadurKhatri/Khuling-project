import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchProjects, createProject, updateProject, deleteProject } from "../../services/projectService.js";
import { fetchCategories } from "../../services/categoryService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";

const emptyForm = {
  title: "", category: "", status: "Ongoing", location: "",
  client: "", budget: "", description: "", thumbnail: "", thumbnailFile: null,
};

const ProjectsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => fetchProjects({ limit: 50 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const categories = categoriesData?.data || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-projects"] });

  const createMutation = useMutation({ mutationFn: createProject, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProject(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteProject, onSuccess: invalidate });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?.name || "" });
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({ ...emptyForm, ...project, thumbnailFile: null });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { thumbnailFile, ...rest } = form;
    const finalThumbnail = thumbnailFile || form.thumbnail;
    if (!finalThumbnail) {
      alert("Please provide a thumbnail — paste an image URL or upload a file.");
      return;
    }
    const payload = { ...rest, thumbnail: finalThumbnail };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this project? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Projects</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ New Project</button>
      </div>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panelClass}`}>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${tableHeaderClass} text-left`}>
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((project) => (
                <tr key={project._id} className={`border-t ${rowClass}`}>
                  <td className="px-4 py-3">{project.title}</td>
                  <td className="px-4 py-3">{project.category}</td>
                  <td className="px-4 py-3">{project.status}</td>
                  <td className="px-4 py-3">{project.location}</td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(project)} className="text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDelete(project._id)} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="font-heading font-semibold text-lg mb-2">{editing ? "Edit Project" : "New Project"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />

            <div>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="" disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                  No categories yet — add one under Admin → Categories first.
                </p>
              )}
            </div>

            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              {['Completed', 'Ongoing', 'Upcoming'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            <input placeholder="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={inputClass} />
            <input placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClass} />

            <ImageSourceField
              theme={theme}
              label="Thumbnail"
              required={!editing}
              urlValue={form.thumbnail}
              fileValue={form.thumbnailFile}
              onUrlChange={(v) => setForm((prev) => ({ ...prev, thumbnail: v }))}
              onFileChange={(f) => setForm((prev) => ({ ...prev, thumbnailFile: f }))}
            />

            <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" className="btn-primary !py-2">{editing ? "Save Changes" : "Create Project"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectsManage;
