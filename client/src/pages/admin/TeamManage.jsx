import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "../../services/teamService.js";
import ImageSourceField from "../../components/admin/ImageSourceField.jsx";

const emptyForm = {
  name: "", designation: "", department: "", bio: "", isLeadership: false,
  image: "", imageFile: null,
  social: { linkedin: "", facebook: "", whatsapp: "", instagram: "", email: "" },
};

const TeamManage = () => {
  const queryClient = useQueryClient();
  const { theme } = useOutletContext();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: fetchTeam,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    queryClient.invalidateQueries({ queryKey: ["team"] });
  };

  const createMutation = useMutation({ mutationFn: createTeamMember, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTeamMember(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteTeamMember, onSuccess: invalidate });

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

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      ...emptyForm,
      ...member,
      imageFile: null,
      social: { linkedin: "", facebook: "", whatsapp: "", instagram: "", email: "", ...(member.social || {}) },
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { imageFile, ...rest } = form;
    const finalImage = imageFile || form.image;
    if (!finalImage) {
      alert("Please provide a photo — paste an image URL or upload a file.");
      return;
    }
    const payload = { ...rest, image: finalImage };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this team member? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Team</h1>
        <button onClick={openCreate} className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">+ New Member</button>
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
                    <th className="px-4 py-3">Photo</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Leadership</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={5} className={`px-4 py-6 text-center ${mutedClass}`}>
                        No team members yet.
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((member) => (
                    <tr key={member._id} className={`border-t ${rowClass}`}>
                      <td className="px-4 py-3">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className={`h-10 w-10 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                        )}
                      </td>
                      <td className="px-4 py-3">{member.name}</td>
                      <td className="px-4 py-3">{member.designation}</td>
                      <td className="px-4 py-3">{member.isLeadership ? <span className="text-teal font-medium">Yes</span> : "—"}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => openEdit(member)} className="text-primary hover:underline">Edit</button>
                        <button onClick={() => handleDelete(member._id)} className="text-red-400 hover:underline">Delete</button>
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
                No team members yet.
              </div>
            )}
            {data?.data?.map((member) => (
              <div key={member._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start gap-3">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="h-14 w-14 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className={`h-14 w-14 shrink-0 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{member.name}</div>
                        <div className={`truncate text-xs ${mutedClass}`}>{member.designation}</div>
                      </div>
                      {member.isLeadership && (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-medium text-teal">
                          Leadership
                        </span>
                      )}
                    </div>
                    {member.department && (
                      <div className={`mt-1 text-xs ${mutedClass}`}>{member.department}</div>
                    )}
                  </div>
                </div>

                <div className={`mt-4 flex gap-2 border-t pt-3 ${rowClass}`}>
                  <button onClick={() => openEdit(member)} className={ghostBtnClass}>Edit</button>
                  <button onClick={() => handleDelete(member._id)} className={dangerBtnClass}>Delete</button>
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
            <h2 className="mb-2 font-heading text-lg font-semibold">{editing ? "Edit Member" : "New Member"}</h2>
            <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input required placeholder="Designation (e.g. Site Engineer)" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
              <input placeholder="Department (optional)" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={inputClass} />
            </div>

            <ImageSourceField
              theme={theme}
              label="Photo"
              required={!editing}
              urlValue={form.image}
              fileValue={form.imageFile}
              onUrlChange={(v) => setForm((prev) => ({ ...prev, image: v }))}
              onFileChange={(f) => setForm((prev) => ({ ...prev, imageFile: f }))}
            />

            <textarea placeholder="Short bio (optional)" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} />

            <div>
              <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>
                Social links (optional)
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input placeholder="LinkedIn URL" value={form.social.linkedin} onChange={(e) => setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })} className={inputClass} />
                <input placeholder="Facebook URL" value={form.social.facebook} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} className={inputClass} />
                <input placeholder="WhatsApp number (e.g. 9779800000000)" value={form.social.whatsapp} onChange={(e) => setForm({ ...form, social: { ...form.social, whatsapp: e.target.value } })} className={inputClass} />
                <input placeholder="Instagram URL" value={form.social.instagram} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} className={inputClass} />
                <input placeholder="Email" value={form.social.email} onChange={(e) => setForm({ ...form, social: { ...form.social, email: e.target.value } })} className={inputClass} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isLeadership} onChange={(e) => setForm({ ...form, isLeadership: e.target.checked })} className="h-4 w-4" />
              Leadership (shown in the featured section)
            </label>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setShowForm(false)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" className="btn-primary w-full !py-2.5 sm:w-auto sm:!py-2">{editing ? "Save Changes" : "Create Member"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamManage;