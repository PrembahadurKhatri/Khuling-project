import { useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchContactMessages, updateContactMessageStatus, deleteContactMessage } from "../../services/contactService.js";
import useToast from "../../hooks/useToast.js";

const statusOptions = ["new", "read", "replied", "archived"];

const statusTone = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-gray-200 text-gray-700",
  replied: "bg-emerald-100 text-emerald-700",
  archived: "bg-gray-200 text-gray-500",
};

const ContactManage = () => {
  const { theme } = useOutletContext();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const typeFilter = searchParams.get("type") || "";
  const statusFilter = searchParams.get("status") || "";
  const [viewing, setViewing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-contact", { type: typeFilter, status: statusFilter }],
    queryFn: () => fetchContactMessages({
      limit: 50,
      ...(typeFilter && { type: typeFilter }),
      ...(statusFilter && { status: statusFilter }),
    }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-contact"] });
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  // No success toast here — status also flips silently to "read" just from
  // opening a message, and popping a toast on every click would be noisy.
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateContactMessageStatus(id, status),
    onSuccess: invalidate,
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => { invalidate(); toast.success("Message deleted."); },
    onError,
  });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const cardClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const mutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const selectClass = theme === "dark"
    ? "rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-100"
    : "rounded-lg border border-line bg-paper px-2 py-1 text-xs text-ink";
  const mobileSelectClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm font-medium text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm font-medium text-ink";
  const ghostBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-gray-800 text-sm font-medium text-gray-100 active:bg-gray-700"
    : "flex-1 min-h-[40px] rounded-lg bg-stone text-sm font-medium text-ink active:bg-line";
  const dangerBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-red-950/40 text-sm font-medium text-red-400 active:bg-red-950/60"
    : "flex-1 min-h-[40px] rounded-lg bg-red-50 text-sm font-medium text-red-500 active:bg-red-100";

  const handleStatusChange = (id, status) => {
    statusMutation.mutate({ id, status });
    // Mark as read locally too if it's still open in the detail view.
    setViewing((v) => (v?._id === id ? { ...v, status } : v));
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this message? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
      setViewing((v) => (v?._id === id ? null : v));
    }
  };

  const openView = (msg) => {
    setViewing(msg);
    if (msg.status === "new") handleStatusChange(msg._id, "read");
  };

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Inquiries</h1>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setParam("type", e.target.value)}
            className={`${selectClass} flex-1 !py-2 !text-sm sm:flex-none sm:!py-1 sm:!text-xs`}
          >
            <option value="">All types</option>
            <option value="contact">Contact</option>
            <option value="quote">Quote Request</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setParam("status", e.target.value)}
            className={`${selectClass} flex-1 !py-2 !text-sm sm:flex-none sm:!py-1 sm:!text-xs`}
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
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
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3">Received</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={6} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No messages yet.
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((msg) => (
                    <tr key={msg._id} className={`border-t ${rowClass} ${msg.status === "new" ? "font-medium" : ""}`}>
                      <td className="px-4 py-3">
                        <div>{msg.name}</div>
                        <div className={`text-xs ${mutedClass}`}>{msg.email}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{msg.type === "quote" ? "Quote Request" : "Contact"}</td>
                      <td className="max-w-xs truncate px-4 py-3">{msg.subject || msg.message}</td>
                      <td className="px-4 py-3">{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                          className={`${selectClass} ${statusTone[msg.status] || ""}`}
                        >
                          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => openView(msg)} className="text-primary hover:underline">View</button>
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
              <div key={msg._id} className={`rounded-2xl border p-4 ${cardClass} ${msg.status === "new" ? "ring-1 ring-primary/30" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`truncate ${msg.status === "new" ? "font-semibold" : "font-medium"}`}>{msg.name}</div>
                    <div className={`truncate text-xs ${mutedClass}`}>{msg.email}</div>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone[msg.status] || ""}`}>
                    {msg.status}
                  </span>
                </div>

                <div className={`mt-2 flex items-center gap-2 text-xs ${mutedClass}`}>
                  <span className={theme === "dark" ? "text-gray-300" : "text-ink"}>
                    {msg.type === "quote" ? "Quote Request" : "Contact"}
                  </span>
                  <span>·</span>
                  <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>

                <p className={`mt-2 line-clamp-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-ink"}`}>
                  {msg.subject || msg.message}
                </p>

                <div className={`mt-4 border-t pt-3 ${rowClass}`}>
                  <select
                    value={msg.status}
                    onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                    className={`${mobileSelectClass} ${statusTone[msg.status] || ""}`}
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => openView(msg)} className={ghostBtnClass}>View</button>
                  <button onClick={() => handleDelete(msg._id)} className={dangerBtnClass}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
          <div className={`max-h-[92vh] w-full space-y-4 overflow-y-auto rounded-t-2xl border p-6 sm:max-w-lg sm:rounded-2xl ${panelClass}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-heading text-lg font-semibold">{viewing.name}</h2>
                <p className={`truncate text-sm ${mutedClass}`}>
                  {viewing.email}{viewing.phone ? ` · ${viewing.phone}` : ""}
                </p>
              </div>
              <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[viewing.status] || ""}`}>{viewing.status}</span>
            </div>

            {viewing.type === "quote" && (
              <div className={`space-y-1 rounded-lg p-3 text-sm ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`}>
                {viewing.projectType && <div><span className="font-medium">Project Type:</span> {viewing.projectType}</div>}
                {viewing.budgetRange && <div><span className="font-medium">Budget:</span> {viewing.budgetRange}</div>}
                {viewing.location && <div><span className="font-medium">Location:</span> {viewing.location}</div>}
              </div>
            )}

            {viewing.subject && <p className="font-medium">{viewing.subject}</p>}
            <p className="whitespace-pre-line text-sm leading-relaxed">{viewing.message}</p>

            <p className={`text-xs ${mutedClass}`}>
              Received {new Date(viewing.createdAt).toLocaleString()}
            </p>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <button onClick={() => setViewing(null)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Close</button>
              <a href={`mailto:${viewing.email}`} className="btn-primary w-full !py-2.5 text-center text-sm sm:w-auto sm:!px-4 sm:!py-2">Reply by Email</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManage;