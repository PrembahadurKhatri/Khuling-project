import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchProjects, createProject, updateProject, deleteProject } from "../../services/projectService.js";

const emptyForm = {
  title: "", category: "Construction", status: "Ongoing", location: "",
  client: "", budget: "", description: "", thumbnail: "",
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
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm(project);
    setShowForm(true);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={handleSubmit} className={`w-full max-w-lg space-y-3 rounded-xl border p-6 ${panelClass}`}>
            <h2 className="font-heading font-semibold text-lg mb-2">{editing ? "Edit Project" : "New Project"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
              {['Construction', 'Infrastructure', 'Road', 'Bridge', 'Building', 'Commercial', 'Residential'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              {['Completed', 'Ongoing', 'Upcoming'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            <input placeholder="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={inputClass} />
            <input placeholder="Budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClass} />
            <input required placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className={inputClass} />
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
