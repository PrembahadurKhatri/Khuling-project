import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/testimonialService.js";

const emptyForm = {
  name: "", designation: "", company: "", message: "", avatar: "", rating: 5, featured: false,
};

const TestimonialsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => fetchTestimonials(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });

  const createMutation = useMutation({ mutationFn: createTestimonial, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTestimonial(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteTestimonial, onSuccess: invalidate });

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

  const openEdit = (testimonial) => {
    setEditing(testimonial);
    setForm({ ...emptyForm, ...testimonial });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, rating: Number(form.rating) };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this testimonial? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Client Testimonials</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ New Testimonial</button>
      </div>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panelClass}`}>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${tableHeaderClass} text-left`}>
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((testimonial) => (
                <tr key={testimonial._id} className={`border-t ${rowClass}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{testimonial.name}</div>
                    <div className={theme === "dark" ? "text-gray-500 text-xs" : "text-gray-500 text-xs"}>
                      {testimonial.designation}
                    </div>
                  </td>
                  <td className="px-4 py-3">{testimonial.company}</td>
                  <td className="px-4 py-3 max-w-sm truncate">{testimonial.message}</td>
                  <td className="px-4 py-3">{"★".repeat(testimonial.rating)}</td>
                  <td className="px-4 py-3">
                    {testimonial.featured ? (
                      <span className="text-xs font-medium text-teal">Featured</span>
                    ) : (
                      <span className={theme === "dark" ? "text-xs text-gray-500" : "text-xs text-gray-400"}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(testimonial)} className="text-primary hover:underline">Edit</button>
                    <button onClick={() => handleDelete(testimonial._id)} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="font-heading font-semibold text-lg mb-2">
              {editing ? "Edit Testimonial" : "New Testimonial"}
            </h2>
            <input required placeholder="Client Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <input placeholder="Designation (e.g. Project Director)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
            <input placeholder="Company / Organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
            <textarea required placeholder="Testimonial message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
            <div>
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Avatar Image URL</label>
              <input placeholder="https://..." value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className={inputClass} />
              {form.avatar && (
                <img src={form.avatar} alt="Preview" className="mt-2 h-16 w-16 rounded-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Rating (1-5)</label>
                <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm pt-5">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured (shown on homepage)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" className="btn-primary !py-2">{editing ? "Save Changes" : "Create Testimonial"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManage;
