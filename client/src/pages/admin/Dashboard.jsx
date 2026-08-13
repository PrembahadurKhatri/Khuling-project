import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchProjects } from "../../services/projectService.js";
import { fetchBlogs } from "../../services/blogService.js";
import { fetchContactMessages } from "../../services/contactService.js";
import { fetchVisitStats } from "../../services/visitService.js";

const StatCard = ({ label, value, sublabel, theme }) => (
  <div className={`rounded-xl border p-6 ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm"}`}>
    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
    <p className="text-3xl font-heading font-bold text-primary mt-2">{value}</p>
    {sublabel && (
      <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{sublabel}</p>
    )}
  </div>
);

const Dashboard = () => {
  const { theme } = useOutletContext();

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
