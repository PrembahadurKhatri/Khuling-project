import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../services/projectService.js";
import ProjectCard from "../components/ProjectCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const categories = ["Construction", "Infrastructure", "Road", "Bridge", "Building", "Commercial", "Residential"];
const statuses = ["Completed", "Ongoing", "Upcoming"];

const Projects = () => {
  const [filters, setFilters] = useState({ status: "", category: "", search: "" });
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", filters, page],
    queryFn: () => fetchProjects({ ...filters, page, limit: 9 }),
  });

  const update = (key, value) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="A record you can verify on the ground."
        crumb="Home / Projects"
      />

      <section className="section">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
          />
          <select value={filters.status} onChange={(e) => update("status", e.target.value)} className="border rounded-lg px-4 py-2">
            <option value="">All Status</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filters.category} onChange={(e) => update("category", e.target.value)} className="border rounded-lg px-4 py-2">
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-center">Loading projects...</p>
        ) : data?.data?.length ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            {data.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: data.pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      page === i + 1 ? "bg-primary text-secondary" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center">No projects match your filters.</p>
        )}
      </section>
    </div>
  );
};

export default Projects;
