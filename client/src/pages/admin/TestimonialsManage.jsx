import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../../services/testimonialService.js";
import useToast from "../../hooks/useToast.js";

const emptyForm = {
  name: "", designation: "", company: "", message: "", avatar: "", rating: 5, featured: false,
};

const initials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const TestimonialsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => fetchTestimonials(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => { invalidate(); toast.success("Testimonial added."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTestimonial(id, payload),
    onSuccess: () => { invalidate(); toast.success("Testimonial updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => { invalidate(); toast.success("Testimonial deleted."); },
    onError,
  });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const cardClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const mutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";
  const ghostBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-gray-800 text-sm font-medium text-gray-100 active:bg-gray-700"
    : "flex-1 min-h-[40px] rounded-lg bg-stone text-sm font-medium text-ink active:bg-line";
  const dangerBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-red-950/40 text-sm font-medium text-red-400 active:bg-red-950/60"
    : "flex-1 min-h-[40px] rounded-lg bg-red-50 text-sm font-medium text-red-500 active:bg-red-100";
  const avatarClass = theme === "dark"
    ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
    : "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary";

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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Client Testimonials</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Testimonial</button>
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
                    <th className="px-4 py-3">Client</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={6} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No testimonials yet.
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((testimonial) => (
                    <tr key={testimonial._id} className={`border-t ${rowClass}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{testimonial.name}</div>
                        <div className={`text-xs ${mutedClass}`}>
                          {testimonial.designation}
                        </div>
                      </td>
                      <td className="px-4 py-3">{testimonial.company}</td>
                      <td className="max-w-sm truncate px-4 py-3">{testimonial.message}</td>
                      <td className="px-4 py-3">{"★".repeat(testimonial.rating)}</td>
                      <td className="px-4 py-3">
                        {testimonial.featured ? (
                          <span className="text-xs font-medium text-teal">Featured</span>
                        ) : (
                          <span className={`text-xs ${mutedClass}`}>—</span>
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

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {data?.data?.length === 0 && (
              <div className={`rounded-xl border px-4 py-8 text-center text-sm ${cardClass} ${mutedClass}`}>
                No testimonials yet.
              </div>
            )}
            {data?.data?.map((testimonial) => (
              <div key={testimonial._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    {testimonial.avatar ? (
                      <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className={avatarClass}>{initials(testimonial.name)}</div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{testimonial.name}</div>
                      <div className={`truncate text-xs ${mutedClass}`}>
                        {[testimonial.designation, testimonial.company].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>
                  {testimonial.featured && (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-medium text-teal">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-amber-500">{"★".repeat(testimonial.rating)}</div>

                {testimonial.message && (
                  <p className={`mt-2 line-clamp-3 text-sm ${theme === "dark" ? "text-gray-300" : "text-ink"}`}>
                    {testimonial.message}
                  </p>
                )}

                <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                  <button onClick={() => openEdit(testimonial)} className={ghostBtnClass}>Edit</button>
                  <button onClick={() => handleDelete(testimonial._id)} className={dangerBtnClass}>Delete</button>
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
            className={`max-h-[92vh] w-full space-y-3 overflow-y-auto rounded-t-2xl border p-6 sm:max-w-lg sm:rounded-2xl ${panelClass}`}
          >
            <h2 className="mb-2 font-heading text-lg font-semibold">
              {editing ? "Edit Testimonial" : "New Testimonial"}
            </h2>
            <input required placeholder="Client Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <input placeholder="Designation (e.g. Project Director)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
            <input placeholder="Company / Organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
            <textarea required placeholder="Testimonial message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
            <div>
              <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>Avatar Image URL</label>
              <input placeholder="https://..." value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className={inputClass} />
              {form.avatar && (
                <img src={form.avatar} alt="Preview" className="mt-2 h-16 w-16 rounded-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="sm:flex-1">
                <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>Rating (1-5)</label>
                <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm sm:pt-5">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4" />
                Featured (shown on homepage)
              </label>
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">{editing ? "Save Changes" : "Create Testimonial"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManage;