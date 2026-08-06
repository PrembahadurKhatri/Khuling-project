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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Team</h1>
        <button onClick={openCreate} className="btn-primary !py-2">+ New Member</button>
      </div>

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panelClass}`}>
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
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className={`w-full max-w-lg space-y-3 rounded-xl border p-6 my-8 ${panelClass}`}>
            <h2 className="font-heading font-semibold text-lg mb-2">{editing ? "Edit Member" : "New Member"}</h2>
            <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            <div className="grid sm:grid-cols-2 gap-3">
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
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                Social links (optional)
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <input placeholder="LinkedIn URL" value={form.social.linkedin} onChange={(e) => setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })} className={inputClass} />
                <input placeholder="Facebook URL" value={form.social.facebook} onChange={(e) => setForm({ ...form, social: { ...form.social, facebook: e.target.value } })} className={inputClass} />
                <input placeholder="WhatsApp number (e.g. 9779800000000)" value={form.social.whatsapp} onChange={(e) => setForm({ ...form, social: { ...form.social, whatsapp: e.target.value } })} className={inputClass} />
                <input placeholder="Instagram URL" value={form.social.instagram} onChange={(e) => setForm({ ...form, social: { ...form.social, instagram: e.target.value } })} className={inputClass} />
                <input placeholder="Email" value={form.social.email} onChange={(e) => setForm({ ...form, social: { ...form.social, email: e.target.value } })} className={inputClass} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isLeadership} onChange={(e) => setForm({ ...form, isLeadership: e.target.checked })} />
              Leadership (shown in the featured section)
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" className="btn-primary !py-2">{editing ? "Save Changes" : "Create Member"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamManage;
