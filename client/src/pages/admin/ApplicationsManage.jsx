import { useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApplications, updateApplicationStatus, deleteApplication } from "../../services/applicationService.js";

const statusOptions = ["received", "shortlisted", "interviewing", "rejected", "hired"];

const statusTone = {
  received: "bg-gray-200 text-gray-700",
  shortlisted: "bg-blue-100 text-blue-700",
  interviewing: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-emerald-100 text-emerald-700",
};

// Local datetime input expects "YYYY-MM-DDTHH:mm"; Mongo gives back full ISO.
const toDatetimeLocal = (value) => (value ? new Date(value).toISOString().slice(0, 16) : "");

const ApplicationsManage = () => {
  const { theme } = useOutletContext();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobFilter = searchParams.get("job") || "";
  const statusFilter = searchParams.get("status") || "";
  const generalFilter = searchParams.get("general") || "";
  const [scheduling, setScheduling] = useState(null); // { app, status } being scheduled
  const [scheduleForm, setScheduleForm] = useState({ interviewDate: "", visitDate: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-applications", { job: jobFilter, status: statusFilter, general: generalFilter }],
    queryFn: () => fetchApplications({
      limit: 50,
      ...(jobFilter && { job: jobFilter }),
      ...(statusFilter && { status: statusFilter }),
      ...(generalFilter && { general: generalFilter }),
    }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-applications"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }) => updateApplicationStatus(id, payload),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteApplication, onSuccess: invalidate });

  const panelClass = theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm";
  const tableHeaderClass = theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-stone text-gray-600";
  const rowClass = theme === "dark" ? "border-gray-800" : "border-line";
  const selectClass = theme === "dark"
    ? "rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-100"
    : "rounded-lg border border-line bg-paper px-2 py-1 text-xs text-ink";
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";

  const handleDelete = async (id) => {
    if (confirm("Delete this application? This cannot be undone.")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const clearJobFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("job");
    setSearchParams(next);
  };

  const handleStatusChange = (app, status) => {
    if (status === "shortlisted" || status === "interviewing") {
      // Both of these notify the applicant with interview/visit dates, so collect them first.
      setScheduling({ app, status });
      setScheduleForm({
        interviewDate: toDatetimeLocal(app.interviewDate),
        visitDate: toDatetimeLocal(app.visitDate),
      });
      return;
    }
    statusMutation.mutate({ id: app._id, payload: { status } });
  };

  const submitSchedule = (e) => {
    e.preventDefault();
    statusMutation.mutate({
      id: scheduling.app._id,
      payload: {
        status: scheduling.status,
        interviewDate: scheduleForm.interviewDate || null,
        visitDate: scheduleForm.visitDate || null,
      },
    });
    setScheduling(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Applications</h1>
        <div className="flex gap-2">
          <select
            value={generalFilter}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("general", e.target.value); else next.delete("general");
              setSearchParams(next);
            }}
            className={selectClass}
          >
            <option value="">All applications</option>
            <option value="true">General only</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("status", e.target.value); else next.delete("status");
              setSearchParams(next);
            }}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {jobFilter && (
        <p className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Filtered to one position. <button onClick={clearJobFilter} className="text-primary hover:underline">Clear filter</button>
        </p>
      )}

      {isLoading ? (
        <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Loading...</p>
      ) : (
        <div className={`overflow-hidden rounded-xl border ${panelClass}`}>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${tableHeaderClass} text-left`}>
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">CV</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-4 py-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    No applications yet.
                  </td>
                </tr>
              )}
              {data?.data?.map((app) => (
                <tr key={app._id} className={`border-t ${rowClass}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{app.name}</div>
                    {(app.links?.github || app.links?.linkedin || app.links?.other) && (
                      <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        {app.links.github && <a href={app.links.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>}
                        {app.links.linkedin && <a href={app.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>}
                        {app.links.other && <a href={app.links.other} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portfolio</a>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {app.job?.title || <span className="text-teal font-medium">General Application</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div>{app.email}</div>
                    {app.phone && <div className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>{app.phone}</div>}
                  </td>
                  <td className="px-4 py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 space-x-2">
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CV</a>
                    {app.coverLetterUrl && (
                      <a href={app.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cover Letter</a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value)}
                      className={`${selectClass} ${statusTone[app.status] || ""}`}
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {(app.status === "shortlisted" || app.status === "interviewing") && (app.interviewDate || app.visitDate) && (
                      <div className={`mt-1 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        {app.interviewDate && <div>Interview: {new Date(app.interviewDate).toLocaleString()}</div>}
                        {app.visitDate && <div>Visit: {new Date(app.visitDate).toLocaleString()}</div>}
                      </div>
                    )}
                    {(app.status === "shortlisted" || app.status === "interviewing") && (
                      <button
                        onClick={() => handleStatusChange(app, app.status)}
                        className="mt-1 text-xs text-primary hover:underline block"
                      >
                        Edit interview/visit date
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(app._id)} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {scheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={submitSchedule} className={`w-full max-w-md space-y-3 rounded-xl border p-6 ${panelClass}`}>
            <h2 className="font-heading font-semibold text-lg mb-1">
              {scheduling.status === "shortlisted" ? "Shortlist" : "Move to Interviewing"} {scheduling.app.name}
            </h2>
            <p className={`text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              These dates are included in the email sent to the applicant. Both are optional.
            </p>

            <div>
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Interview Date &amp; Time</label>
              <input
                type="datetime-local"
                value={scheduleForm.interviewDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Site Visit Date &amp; Time</label>
              <input
                type="datetime-local"
                value={scheduleForm.visitDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, visitDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setScheduling(null)} className={`px-4 py-2 rounded-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Cancel</button>
              <button type="submit" className="btn-primary !py-2">Save &amp; Notify Applicant</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManage;
