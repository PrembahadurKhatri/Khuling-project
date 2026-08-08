import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from "../../services/blogService.js";
import RichTextEditor from "../../components/admin/RichTextEditor.jsx";
import useToast from "../../hooks/useToast.js";

const emptyForm = {
  title: "", excerpt: "", content: "", category: "", tags: "", status: "draft", featuredImage: null,
};

const statusTone = {
  draft: "bg-gray-200 text-gray-700",
  published: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
};

const BlogsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => fetchBlogs({ limit: 50 }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => { invalidate(); toast.success("Post created."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateBlog(id, payload),
    onSuccess: () => { invalidate(); toast.success("Post updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => { invalidate(); toast.success("Post deleted."); },
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
    setForm(emptyForm);
    setPreview(null);
    setShowForm(true);
  };

  const openEdit = (blog) => {
    setEditing(blog);
    setForm({
      title: blog.title,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "",
      tags: (blog.tags || []).join(", "),
      status: blog.status,
      featuredImage: null,
    });
    setPreview(blog.featuredImage || null);
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, featuredImage: file });
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
    if (confirm("Delete this post? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Journal / Blog</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Post</button>
      </div>

      {isLoading ? (
        <p className={mutedClass}>Loading...</p>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className={`hidden overflow-hidden rounded-xl border md:block ${panelClass}`}>
            <table className="w-full text-sm">
              <thead className={`${tableHeaderClass} text-left`}>
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`px-4 py-6 text-center ${mutedClass}`}>
                      No posts yet.
                    </td>
                  </tr>
                )}
                {data?.data?.map((blog) => (
                  <tr key={blog._id} className={`border-t ${rowClass}`}>
                    <td className="px-4 py-3">{blog.title}</td>
                    <td className="px-4 py-3">{blog.category}</td>
                    <td className="px-4 py-3 capitalize">{blog.status}</td>
                    <td className="px-4 py-3">{blog.views}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button onClick={() => openEdit(blog)} className="text-primary hover:underline">Edit</button>
                      <button onClick={() => handleDelete(blog._id)} className="text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {data?.data?.length === 0 && (
              <div className={`rounded-xl border px-4 py-8 text-center text-sm ${cardClass} ${mutedClass}`}>
                No posts yet.
              </div>
            )}
            {data?.data?.map((blog) => (
              <div key={blog._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-2 font-semibold leading-snug">{blog.title}</div>
                    {blog.category && (
                      <div className={`mt-1 text-xs font-medium ${mutedClass}`}>{blog.category}</div>
                    )}
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${statusTone[blog.status] || ""}`}>
                    {blog.status}
                  </span>
                </div>

                <div className={`mt-3 flex items-center gap-1.5 text-xs ${mutedClass}`}>
                  <span>{blog.views ?? 0} views</span>
                </div>

                <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                  <button onClick={() => openEdit(blog)} className={ghostBtnClass}>Edit</button>
                  <button onClick={() => handleDelete(blog._id)} className={dangerBtnClass}>Delete</button>
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
            className={`my-0 max-h-[92vh] w-full space-y-3 overflow-y-auto rounded-t-2xl border p-6 sm:my-8 sm:max-w-2xl sm:rounded-2xl ${panelClass}`}
          >
            <h2 className="mb-2 font-heading text-lg font-semibold">{editing ? "Edit Post" : "New Post"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            <textarea placeholder="Excerpt (short summary)" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs ${mutedClass}`}>Content</label>
              <RichTextEditor theme={theme} value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                {["draft", "published", "scheduled"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs ${mutedClass}`}>Featured image</label>
              {preview && <img src={preview} alt="Featured preview" className="mb-2 h-32 w-full rounded-lg object-cover" />}
              <input type="file" accept="image/*" onChange={handleFileChange} className={inputClass} required={!editing} />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">
                {editing ? "Save Changes" : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogsManage;