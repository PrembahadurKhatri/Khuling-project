import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchMessages, createMessage, updateMessage, deleteMessage } from "../../services/messageService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";
import useToast from "../../hooks/useToast.js";

const emptyForm = { name: "", designation: "", message: "", order: 0, photo: "", photoFile: null };

const MessagesManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: fetchMessages,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    queryClient.invalidateQueries({ queryKey: ["home-messages"] });
  };
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const createMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => { invalidate(); toast.success("Message added."); },
    onError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateMessage(id, payload),
    onSuccess: () => { invalidate(); toast.success("Message updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => { invalidate(); toast.success("Message removed."); },
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
    setShowForm(true);
  };

  const openEdit = (msg) => {
    setEditing(msg);
    setForm({ ...emptyForm, ...msg, photoFile: null });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { photoFile, ...rest } = form;
    const payload = { ...rest, photo: photoFile || form.photo };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this message? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Message</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Message</button>
      </div>
      <p className={`text-sm -mt-4 mb-6 max-w-2xl ${mutedClass}`}>
        Leadership messages shown on the homepage — one entry per post (Managing Director, CEO, Treasurer, ...).
        Sorted by "Order" (lowest first).
      </p>

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
                    <th className="px-4 py-3">Photo</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Post</th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No messages yet.
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((msg) => (
                    <tr key={msg._id} className={`border-t ${rowClass}`}>
                      <td className="px-4 py-3">
                        {msg.photo ? (
                          <img src={msg.photo} alt={msg.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className={`h-10 w-10 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                        )}
                      </td>
                      <td className="px-4 py-3">{msg.name}</td>
                      <td className="px-4 py-3">{msg.designation}</td>
                      <td className="px-4 py-3">{msg.order}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => openEdit(msg)} className="text-primary hover:underline">Edit</button>
                        <button onClick={() => handleDelete(msg._id)} className="text-red-400 hover:underline">Delete</button>
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
                No messages yet.
              </div>
            )}
            {data?.data?.map((msg) => (
              <div key={msg._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start gap-3">
                  {msg.photo ? (
                    <img src={msg.photo} alt={msg.name} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className={`h-14 w-14 shrink-0 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{msg.name}</div>
                    <div className={`truncate text-xs ${mutedClass}`}>{msg.designation}</div>
                  </div>
                </div>
                <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                  <button onClick={() => openEdit(msg)} className={ghostBtnClass}>Edit</button>
                  <button onClick={() => handleDelete(msg._id)} className={dangerBtnClass}>Delete</button>
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
            <h2 className="mb-2 font-heading text-lg font-semibold">{editing ? "Edit Message" : "New Message"}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              <input required placeholder="Post (e.g. Managing Director)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
            </div>

            <ImageSourceField
              theme={theme}
              label="Photo"
              urlValue={form.photo}
              fileValue={form.photoFile}
              onUrlChange={(v) => setForm((prev) => ({ ...prev, photo: v }))}
              onFileChange={(f) => setForm((prev) => ({ ...prev, photoFile: f }))}
            />

            <textarea required placeholder="Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />

            <label className="space-y-1 block">
              <span className={`text-xs ${mutedClass}`}>Display order (lower shows first)</span>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className={inputClass}
              />
            </label>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">
                {createMutation.isPending || updateMutation.isPending ? "Uploading..." : editing ? "Save Changes" : "Create Message"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessagesManage;
