import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchProjects } from "../../services/projectService.js";

const StatCard = ({ label, value, theme }) => (
  <div className={`rounded-xl border p-6 ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm"}`}>
    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
    <p className="text-3xl font-heading font-bold text-primary mt-2">{value}</p>
  </div>
);

const Dashboard = () => {
  const { theme } = useOutletContext();
  const { data } = useQuery({ queryKey: ["admin-projects-count"], queryFn: () => fetchProjects({ limit: 1 }) });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>CMS overview</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Projects" value={data?.total ?? "—"} theme={theme} />
        <StatCard label="Blog Posts" value="—" theme={theme} />
        <StatCard label="New Messages" value="—" theme={theme} />
        <StatCard label="Website Visitors" value="—" theme={theme} />
      </div>

      <div className={`mt-10 rounded-xl border p-6 ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-paper border-line shadow-sm"}`}>
        <h2 className="font-heading font-semibold mb-2">Getting Started</h2>
        <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          This dashboard is wired to the live API for projects. Use the sidebar to manage projects,
          and extend this pattern (see <code className="text-primary">ProjectsManage.jsx</code>) to add
          Blog, Services, Gallery, Team, Careers, and Inquiry management screens as your CMS grows.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
