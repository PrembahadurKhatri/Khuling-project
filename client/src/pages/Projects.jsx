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
  <div className="mb-10 md:mb-14 backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">

  {/* Search */}
  <div className="relative w-full group">
    <svg
      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40 group-focus-within:text-gold transition-colors duration-300 pointer-events-none"
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>

    <input
      type="text"
      placeholder="Search projects..."
      value={filters.search}
      onChange={(e) => update("search", e.target.value)}
      className="w-full pl-10 pr-9 py-3 rounded-xl border border-line/70 bg-white/80
                 font-body text-sm md:text-base text-navy placeholder:text-navy/35
                 shadow-sm transition-all duration-300
                 focus:outline-none focus:border-gold/60 focus:ring-4 focus:ring-gold/10
                 hover:border-navy/20"
    />

    {filters.search && (
      <button
        type="button"
        onClick={() => update("search", "")}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy transition-colors"
        aria-label="Clear search"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>

  {/* Filters Row */}
  <div className="flex gap-3 w-full md:w-auto">
    
    {/* Status */}
    <select
      value={filters.status}
      onChange={(e) => update("status", e.target.value)}
      className="flex-1 md:flex-none min-w-0 md:min-w-[160px] px-4 py-3 rounded-xl border border-line bg-white/80 focus:outline-none focus:ring-2 focus:ring-navy/30 transition text-sm md:text-base"
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
      className="flex-1 md:flex-none min-w-0 md:min-w-[160px] px-4 py-3 rounded-xl border border-line bg-white/80 focus:outline-none focus:ring-2 focus:ring-navy/30 transition text-sm md:text-base"
    >
      <option value="">All Categories</option>
      {categories.map((c) => (
        <option key={c._id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>

  </div>
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