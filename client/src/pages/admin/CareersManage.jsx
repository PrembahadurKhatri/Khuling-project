import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext, Link } from "react-router-dom";
import { fetchCareers, createCareer, updateCareer, deleteCareer } from "../../services/careerService.js";

const emptyForm = {
  title: "", department: "", location: "", type: "Full-time", status: "open",
  positionsAvailable: 1, salary: "", experience: "", ageRequirement: "",
  qualifications: "", requirements: "", description: "", deadline: "",
};

// Career docs store qualifications/requirements as arrays; the form edits them as
// one-item-per-line text, so convert on the way in and out.
const toFormValues = (career) => ({
  ...emptyForm,
  ...career,
  qualifications: (career.qualifications || []).join("\n"),
  requirements: (career.requirements || []).join("\n"),
  deadline: career.deadline ? new Date(career.deadline).toISOString().slice(0, 10) : "",
});

const toPayload = (form) => ({
  ...form,
  positionsAvailable: Number(form.positionsAvailable) || 0,
  qualifications: form.qualifications.split("\n").map((s) => s.trim()).filter(Boolean),
  requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
  deadline: form.deadline || undefined,
});

const CareersManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-careers"],
    queryFn: () => fetchCareers({ limit: 50 }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-careers"] });

  const createMutation = useMutation({ mutationFn: createCareer, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCareer(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteCareer, onSuccess: invalidate });

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

  const openEdit = (career) => {
    setEditing(career);
    setForm(toFormValues(career));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = toPayload(form);
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this position? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Careers</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ New Position</button>
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
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Positions</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((career) => (
                <tr key={career._id} className={`border-t ${rowClass}`}>
                  <td className="px-4 py-3">{career.title}</td>
                  <td className="px-4 py-3">{career.department || "—"}</td>
                  <td className="px-4 py-3">{career.type}</td>
                  <td className="px-4 py-3">{career.positionsAvailable}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${career.status === "open" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                      {career.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link to={`/admin/applications?job=${career._id}`} className="text-primary hover:underline">Applications</Link>
                    <button onClick={() => openEdit(career)} className="text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDelete(career._id)} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="font-heading font-semibold text-lg mb-2">{editing ? "Edit Position" : "New Position"}</h2>

            <input required placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />

            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
              <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                {["Full-time", "Part-time", "Contract", "Internship"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                {["open", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Positions Open</label>
                <input required type="number" min="0" placeholder="Positions Open" value={form.positionsAvailable} onChange={(e) => setForm({ ...form, positionsAvailable: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Application Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Salary (e.g. NPR 40,000 - 60,000)" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className={inputClass} />
              <input placeholder="Experience (e.g. 3+ years)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className={inputClass} />
            </div>

            <input placeholder="Age Requirement (e.g. 21 - 40 years)" value={form.ageRequirement} onChange={(e) => setForm({ ...form, ageRequirement: e.target.value })} className={inputClass} />

            <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Qualifications (one per line)</label>
              <textarea rows={3} placeholder={"Bachelor's degree in Civil Engineering\nValid driving license"} value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} className={inputClass} />
            </div>

            <div>
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Other Requirements (one per line)</label>
              <textarea rows={3} placeholder={"Willing to travel to site locations\nStrong communication skills"} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className={inputClass} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" className="btn-primary !py-2">{editing ? "Save Changes" : "Create Position"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CareersManage;
