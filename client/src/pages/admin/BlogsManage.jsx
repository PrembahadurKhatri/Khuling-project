import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchBlogs, createBlog, updateBlog, deleteBlog } from "../../services/blogService.js";
import RichTextEditor from "../../components/admin/RichTextEditor.jsx";

const emptyForm = {
  title: "", excerpt: "", content: "", category: "", tags: "", status: "draft", featuredImage: null,
};

const BlogsManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => fetchBlogs({ limit: 50 }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });

  const createMutation = useMutation({ mutationFn: createBlog, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateBlog(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteBlog, onSuccess: invalidate });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Journal / Blog</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ New Post</button>
      </div>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panelClass}`}>
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
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className={`w-full max-w-2xl space-y-3 rounded-xl border p-6 my-8 ${panelClass}`}>
            <h2 className="font-heading font-semibold text-lg mb-2">{editing ? "Edit Post" : "New Post"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            <textarea placeholder="Excerpt (short summary)" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />

            <div>
              <label className={`text-xs block mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Content</label>
              <RichTextEditor theme={theme} value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                {["draft", "published", "scheduled"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} />

            <div>
              <label className={`text-xs block mb-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Featured image</label>
              {preview && <img src={preview} alt="Featured preview" className="h-32 w-full object-cover rounded-lg mb-2" />}
              <input type="file" accept="image/*" onChange={handleFileChange} className={inputClass} required={!editing} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary !py-2">
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
