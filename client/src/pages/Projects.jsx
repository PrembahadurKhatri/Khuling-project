import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProjects } from "../services/projectService.js";
import { fetchCategories } from "../services/categoryService.js";
import ProjectCard from "../components/ProjectCard.jsx";
import PageHeader from "../components/PageHeader.jsx";

const statuses = ["Completed", "Ongoing", "Upcoming"];

const Projects = () => {
  const [searchParams] = useSearchParams();
  // Seeds the category filter from a deep link, e.g. the "Related Projects"
  // button on a Service card (/projects?category=Bridge).
  const [filters, setFilters] = useState({
    status: "",
    category: searchParams.get("category") || "",
    search: "",
  });

  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["projects", filters, page],
    queryFn: () => fetchProjects({ ...filters, page, limit: 9 }),
  });

  // Admin-managed list (Admin → Categories) — keeps this dropdown in sync
  // with whatever categories actually exist, instead of a hardcoded array
  // that silently drifts out of date as new ones get added.
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const categories = categoriesData?.data || [];

  const update = (key, value) => {
    setPage(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="relative">
      {/* Header */}
      <PageHeader
        eyebrow="Portfolio"
        title="A record you can verify on the ground."
        crumb="Home / Projects"
      />

      <section className="section relative">
        {/* 🔵 Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,42,76,0.05),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(11,31,58,0.05),transparent_40%)]" />

        {/*  Filter Bar */}
        <div className="mb-14 backdrop-blur-md bg-white/70 border border-line rounded-xl p-6 shadow-soft flex flex-wrap gap-4 items-center">
          
          {/* Search */}
          <input
            type="text"
            placeholder=" Search projects ..."
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            className="flex-1 min-w-[220px] px-4 py-3 rounded-lg border border-line bg-white/80 focus:outline-none focus:ring-2 focus:ring-navy/30 transition"
          />

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
            className="min-w-[170px] px-4 py-3 rounded-lg border border-line bg-white/80 focus:outline-none focus:ring-2 focus:ring-navy/30 transition"
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => update("category", e.target.value)}
            className="min-w-[170px] px-4 py-3 rounded-lg border border-line bg-white/80 focus:outline-none focus:ring-2 focus:ring-navy/30 transition"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔄 Loading Skeleton */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[260px] rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : data?.data?.length ? (
          <>
            {/* 🧩 Project Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {data.data.map((project) => (
                <div
                  key={project._id}
                  className="group transition-transform duration-300 hover:-translate-y-2"
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>

            {/* 📄 Pagination */}
            {data.pages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16 flex-wrap">
                {Array.from({ length: data.pages }).map((_, i) => {
                  const isActive = page === i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-navy text-white shadow-lg scale-105"
                          : "bg-white border border-line text-navy/70 hover:bg-navy hover:text-white"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* ❌ Empty State */
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-navy font-body mb-2">
              No Projects Found
            </h3>
            <p className="text-navy/60 font-body">
              Try adjusting your filters or search keywords.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;