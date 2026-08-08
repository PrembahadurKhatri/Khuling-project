import { useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApplications, updateApplicationStatus, deleteApplication } from "../../services/applicationService.js";
import useToast from "../../hooks/useToast.js";

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

const initials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const ApplicationsManage = () => {
  const { theme } = useOutletContext();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobFilter = searchParams.get("job") || "";
  const statusFilter = searchParams.get("status") || "";
  const generalFilter = searchParams.get("general") || "";
  const [scheduling, setScheduling] = useState(null); // { app, status } being scheduled
  const [scheduleForm, setScheduleForm] = useState({ interviewDate: "", visitDate: "" });
  const [viewing, setViewing] = useState(null); // full applicant detail modal

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
  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong.");

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }) => updateApplicationStatus(id, payload),
    onSuccess: () => { invalidate(); toast.success("Status updated."); },
    onError,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => { invalidate(); toast.success("Application deleted."); },
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
  const inputClass = theme === "dark"
    ? "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100"
    : "w-full rounded-lg border border-line bg-paper px-3 py-2 text-ink";
  const pillClass = theme === "dark"
    ? "inline-flex items-center rounded-full bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200"
    : "inline-flex items-center rounded-full bg-stone px-3 py-1.5 text-xs font-medium text-ink";
  const ghostBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-gray-800 text-sm font-medium text-gray-100 active:bg-gray-700"
    : "flex-1 min-h-[40px] rounded-lg bg-stone text-sm font-medium text-ink active:bg-line";
  const dangerBtnClass = theme === "dark"
    ? "flex-1 min-h-[40px] rounded-lg bg-red-950/40 text-sm font-medium text-red-400 active:bg-red-950/60"
    : "flex-1 min-h-[40px] rounded-lg bg-red-50 text-sm font-medium text-red-500 active:bg-red-100";
  const avatarClass = theme === "dark"
    ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary";

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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-body font-bold">Applications</h1>
        <div className="flex gap-2">
          <select
            value={generalFilter}
            onChange={(e) => {
              const next = new URLSearchParams(searchParams);
              if (e.target.value) next.set("general", e.target.value); else next.delete("general");
              setSearchParams(next);
            }}
            className={`${selectClass} flex-1 !py-2 !text-sm sm:flex-none sm:!py-1 sm:!text-xs`}
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
            className={`${selectClass} flex-1 !py-2 !text-sm sm:flex-none sm:!py-1 sm:!text-xs`}
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {jobFilter && (
        <p className={`mb-4 text-sm ${mutedClass}`}>
          Filtered to one position. <button onClick={clearJobFilter} className="text-primary hover:underline">Clear filter</button>
        </p>
      )}

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
                      <td colSpan={7} className={`px-4 py-6 text-center ${mutedClass}`}>
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
                        {app.phone && <div className={mutedClass}>{app.phone}</div>}
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
                          <div className={`mt-1 text-xs ${mutedClass}`}>
                            {app.interviewDate && <div>Interview: {new Date(app.interviewDate).toLocaleString()}</div>}
                            {app.visitDate && <div>Visit: {new Date(app.visitDate).toLocaleString()}</div>}
                          </div>
                        )}
                        {(app.status === "shortlisted" || app.status === "interviewing") && (
                          <button
                            onClick={() => handleStatusChange(app, app.status)}
                            className="mt-1 block text-xs text-primary hover:underline"
                          >
                            Edit interview/visit date
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => setViewing(app)} className="text-primary hover:underline">View</button>
                        <button onClick={() => handleDelete(app._id)} className="text-red-400 hover:underline">Delete</button>
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
                No applications yet.
              </div>
            )}
            {data?.data?.map((app) => (
              <div key={app._id} className={`rounded-2xl border p-4 ${cardClass}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={avatarClass}>{initials(app.name)}</div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{app.name}</div>
                      <div className={`truncate text-xs font-medium ${app.job?.title ? mutedClass : "text-teal"}`}>
                        {app.job?.title || "General Application"}
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone[app.status] || ""}`}>
                    {app.status}
                  </span>
                </div>

                <div className={`mt-3 space-y-0.5 text-sm ${theme === "dark" ? "text-gray-300" : "text-ink"}`}>
                  <div className="truncate">{app.email}</div>
                  {app.phone && <div className={mutedClass}>{app.phone}</div>}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className={`text-xs ${mutedClass}`}>{new Date(app.createdAt).toLocaleDateString()}</span>
                  <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className={pillClass}>CV</a>
                  {app.coverLetterUrl && (
                    <a href={app.coverLetterUrl} target="_blank" rel="noopener noreferrer" className={pillClass}>Cover Letter</a>
                  )}
                  {app.links?.github && <a href={app.links.github} target="_blank" rel="noopener noreferrer" className={pillClass}>GitHub</a>}
                  {app.links?.linkedin && <a href={app.links.linkedin} target="_blank" rel="noopener noreferrer" className={pillClass}>LinkedIn</a>}
                  {app.links?.other && <a href={app.links.other} target="_blank" rel="noopener noreferrer" className={pillClass}>Portfolio</a>}
                </div>

                {(app.status === "shortlisted" || app.status === "interviewing") && (app.interviewDate || app.visitDate) && (
                  <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-stone text-gray-600"}`}>
                    {app.interviewDate && <div>Interview: {new Date(app.interviewDate).toLocaleString()}</div>}
                    {app.visitDate && <div>Visit: {new Date(app.visitDate).toLocaleString()}</div>}
                  </div>
                )}

                <div className={`mt-4 border-t pt-3 ${rowClass}`}>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app, e.target.value)}
                    className={mobileSelectClass}
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {(app.status === "shortlisted" || app.status === "interviewing") && (
                    <button
                      onClick={() => handleStatusChange(app, app.status)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      Edit interview/visit date
                    </button>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => setViewing(app)} className={ghostBtnClass}>View</button>
                  <button onClick={() => handleDelete(app._id)} className={dangerBtnClass}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {scheduling && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
          <form
            onSubmit={submitSchedule}
            className={`max-h-[92vh] w-full space-y-3 overflow-y-auto rounded-t-2xl border p-6 sm:max-w-md sm:rounded-2xl ${panelClass}`}
          >
            <h2 className="mb-1 font-heading text-lg font-semibold">
              {scheduling.status === "shortlisted" ? "Shortlist" : "Move to Interviewing"} {scheduling.app.name}
            </h2>
            <p className={`mb-3 text-sm ${mutedClass}`}>
              These dates are included in the email sent to the applicant. Both are optional.
            </p>

            <div>
              <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>Interview Date &amp; Time</label>
              <input
                type="datetime-local"
                value={scheduleForm.interviewDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, interviewDate: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={`mb-1 block text-xs font-medium ${mutedClass}`}>Site Visit Date &amp; Time</label>
              <input
                type="datetime-local"
                value={scheduleForm.visitDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, visitDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button type="button" onClick={() => setScheduling(null)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Cancel</button>
              <button type="submit" className="btn-primary w-full !py-2.5 sm:w-auto">Save &amp; Notify Applicant</button>
            </div>
          </form>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4">
          <div className={`max-h-[92vh] w-full space-y-4 overflow-y-auto rounded-t-2xl border p-6 sm:max-w-lg sm:rounded-2xl ${panelClass}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className={avatarClass}>{initials(viewing.name)}</div>
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-lg font-semibold">{viewing.name}</h2>
                  <p className={`truncate text-sm ${mutedClass}`}>
                    {viewing.job?.title || "General Application"}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[viewing.status] || ""}`}>{viewing.status}</span>
            </div>

            <div className={`space-y-1 rounded-lg p-3 text-sm ${theme === "dark" ? "bg-gray-800" : "bg-stone"}`}>
              <div className="break-words"><span className="font-medium">Email:</span> <a href={`mailto:${viewing.email}`} className="text-primary hover:underline">{viewing.email}</a></div>
              {viewing.phone && <div><span className="font-medium">Phone:</span> {viewing.phone}</div>}
              <div><span className="font-medium">Submitted:</span> {new Date(viewing.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${mutedClass}`}>Documents</p>
              <div className="flex flex-wrap gap-2">
                <a href={viewing.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !px-3 !py-2 text-xs">View CV / Resume</a>
                {viewing.coverLetterUrl ? (
                  <a href={viewing.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !px-3 !py-2 text-xs">View Cover Letter</a>
                ) : (
                  <span className={`px-3 py-2 text-xs ${mutedClass}`}>No cover letter submitted</span>
                )}
              </div>
            </div>

            {(viewing.links?.github || viewing.links?.linkedin || viewing.links?.other) && (
              <div>
                <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${mutedClass}`}>Links</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {viewing.links.github && <a href={viewing.links.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>}
                  {viewing.links.linkedin && <a href={viewing.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">LinkedIn</a>}
                  {viewing.links.other && <a href={viewing.links.other} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Portfolio / Other</a>}
                </div>
              </div>
            )}

            {(viewing.interviewDate || viewing.visitDate) && (
              <div className={`space-y-1 text-sm ${mutedClass}`}>
                {viewing.interviewDate && <div>Interview: {new Date(viewing.interviewDate).toLocaleString()}</div>}
                {viewing.visitDate && <div>Site Visit: {new Date(viewing.visitDate).toLocaleString()}</div>}
              </div>
            )}

            <div>
              <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${mutedClass}`}>Status</p>
              <select
                value={viewing.status}
                onChange={(e) => {
                  setViewing(null);
                  handleStatusChange(viewing, e.target.value);
                }}
                className={`${mobileSelectClass} ${statusTone[viewing.status] || ""}`}
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setViewing(null)} className={`w-full rounded-lg px-4 py-2.5 text-center sm:w-auto ${mutedClass}`}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsManage;