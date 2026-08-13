import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchProjects, createProject, updateProject, deleteProject } from "../../services/projectService.js";
import { fetchCategories } from "../../services/categoryService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";
import useToast from "../../hooks/useToast.js";

const emptyForm = {
  title: "", category: "", status: "Ongoing", location: "",
  client: "", budget: "", description: "", thumbnail: "", thumbnailFile: null,
  startDate: "", endDate: "",
};

// Mongo gives back a full ISO datetime; <input type="date"> needs "YYYY-MM-DD".
const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const statusTone = {
  Completed: "bg-emerald-100 text-emerald-700",
  Ongoing: "bg-amber-100 text-amber-700",
  Upcoming: "bg-blue-100 text-blue-700",
};

const ProjectsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
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

  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => { invalidate(); toast.success("Project created."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProject(id, payload),
    onSuccess: () => { invalidate(); toast.success("Project updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => { invalidate(); toast.success("Project deleted."); },
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
    setForm({ ...emptyForm, category: categories[0]?.name || "" });
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      ...emptyForm,
      ...project,
      thumbnailFile: null,
      startDate: toDateInput(project.startDate),
      endDate: toDateInput(project.endDate),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { thumbnailFile, ...rest } = form;
    const finalThumbnail = thumbnailFile || form.thumbnail;
    if (!finalThumbnail) {
      toast.error("Please provide a thumbnail — paste an image URL or upload a file.");
      return;
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      toast.error("End date can't be before the start date.");
      return;
    }
    const payload = {
      ...rest,
      thumbnail: finalThumbnail,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    };
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Projects</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Project</button>
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
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No projects yet.
                      </td>
                    </tr>
                  )}
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

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {data?.data?.length === 0 && (
              <div className={`rounded-xl font-body border px-4 py-8 text-center text-sm ${cardClass} ${mutedClass}`}>
                No projects yet.
              </div>
            )}
            {data?.data?.map((project) => (
              <div key={project._id} className={`overflow-hidden rounded-2xl border ${cardClass}`}>
                {project.thumbnail && (
                  <img src={project.thumbnail} alt="" className="h-32 w-full object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{project.title}</div>
                      <div className={`mt-0.5 truncate text-xs ${mutedClass}`}>
                        {project.category}{project.location ? ` · ${project.location}` : ""}
                      </div>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone[project.status] || "bg-gray-200 text-gray-600"}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                    <button onClick={() => openEdit(project)} className={ghostBtnClass}>Edit</button>
                    <button onClick={() => handleDelete(project._id)} className={dangerBtnClass}>Delete</button>
                  </div>
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
            <h2 className="mb-2 font-body text-lg font-semibold">{editing ? "Edit Project" : "New Project"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />

            <div>
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="" disabled>Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className={`mt-1 text-xs ${mutedClass}`}>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>End Date</label>
                <input type="date" value={form.endDate} min={form.startDate || undefined} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputClass} />
              </div>
            </div>

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

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">{editing ? "Save Changes" : "Create Project"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectsManage;