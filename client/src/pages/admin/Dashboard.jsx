import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchProjects } from "../../services/projectService.js";
import { fetchBlogs } from "../../services/blogService.js";
import { fetchContactMessages } from "../../services/contactService.js";
import { fetchVisitStats, resetVisits } from "../../services/visitService.js";
import useToast from "../../hooks/useToast.js";

const StatCard = ({ label, value, sublabel, theme, action }) => (
  <div className={`relative rounded-xl border p-6 ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm"}`}>
    <div className="flex items-start justify-between gap-2">
      <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
      {action}
    </div>
    <p className="text-3xl font-heading font-bold text-primary mt-2">{value}</p>
    {sublabel && (
      <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{sublabel}</p>
    )}
  </div>
);

const Dashboard = () => {
  const { theme } = useOutletContext();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: projectsData } = useQuery({
    queryKey: ["admin-projects-count"],
    queryFn: () => fetchProjects({ limit: 1 }),
  });
  const { data: blogsData } = useQuery({
    queryKey: ["admin-blogs-count"],
    queryFn: () => fetchBlogs({ limit: 1 }),
  });
  const { data: messagesData } = useQuery({
    queryKey: ["admin-new-messages-count"],
    queryFn: () => fetchContactMessages({ status: "new", limit: 1 }),
  });
  const { data: visitsData } = useQuery({
    queryKey: ["admin-visit-stats"],
    queryFn: fetchVisitStats,
  });

  const resetMutation = useMutation({
    mutationFn: resetVisits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visit-stats"] });
      toast?.success("Visitor count reset to 0.");
    },
    onError: (err) => toast?.error(err.response?.data?.message || "Failed to reset visitor count."),
  });

  const handleResetVisits = () => {
    if (confirm("Reset the visitor count to 0? This permanently deletes all recorded visits and can't be undone — typically done once, right before handing the site over to a client.")) {
      resetMutation.mutate();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-body font-bold">Dashboard</h1>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>CMS overview</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Projects" value={projectsData?.total ?? "—"} theme={theme} />
        <StatCard label="Blog Posts" value={blogsData?.total ?? "—"} theme={theme} />
        <StatCard label="New Messages" value={messagesData?.total ?? "—"} theme={theme} />
        <StatCard
          label="Website Visitors"
          value={visitsData?.data?.total ?? "—"}
          sublabel={visitsData?.data ? `${visitsData.data.last7Days} in the last 7 days` : undefined}
          theme={theme}
          action={
            <button
              type="button"
              onClick={handleResetVisits}
              disabled={resetMutation.isPending}
              title="Reset to 0 — for handing the site over to a client"
              className={`text-[11px] font-medium shrink-0 hover:underline disabled:opacity-50 ${theme === "dark" ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`}
            >
              {resetMutation.isPending ? "Resetting..." : "Reset"}
            </button>
          }
        />
      </div>

      <div className={`mt-10 rounded-xl border p-6 ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm"}`}>
        <h2 className="font-body font-semibold mb-2">Getting Started</h2>
        <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          This dashboard is wired to the live API. Use the sidebar to manage projects,
          and extend this pattern (see <code className="text-primary">ProjectsManage.jsx</code>) to add
          further management screens as your CMS grows.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
