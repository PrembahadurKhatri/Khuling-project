import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader.jsx";
import { fetchCareers } from "../services/careerService.js";

const Careers = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["careers", { status: "open" }],
    queryFn: () => fetchCareers({ status: "open", limit: 50 }),
  });

  const jobs = data?.data || [];

  const handleQuickApply = (e) => {
    const slug = e.target.value;
    if (slug) navigate(`/careers/${slug}?apply=1`);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Join the Team"
        title="Built by the people who show up on site."
        crumb="Home / Careers"
      />

      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* ---------------- Job List ---------------- */}
        <div className="lg:col-span-8">
          <div className="flex items-baseline justify-between border-b border-line pb-5 mb-2">
            <p className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-navy">
              Open Positions
            </p>
            {!isLoading && (
              <p className="font-body text-[11px] font-semibold tracking-[0.18em] uppercase text-navy">
                {jobs.length} {jobs.length === 1 ? "Role" : "Roles"}
              </p>
            )}
          </div>

          {isLoading && (
            <div className="space-y-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="border border-line px-7 py-8 flex items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-2/3 bg-line/40 animate-pulse rounded-sm" />
                    <div className="h-3 w-1/3 bg-line/30 animate-pulse rounded-sm" />
                  </div>
                  <div className="h-9 w-24 bg-line/30 animate-pulse rounded-sm shrink-0" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && jobs.length === 0 && (
            <div className="border border-line px-10 py-16 text-center">
              <p className="font-body font-bold text-lg text-navy mb-2">No open positions right now</p>
              <p className="font-body text-sm text-navy/80">
                Check back soon, or reach out to be considered for future roles.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {jobs.map((job, i) => (
              <div
                key={job._id}
                className="border border-line hover:border-navy/25 bg-white px-7 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group transition-all duration-300 hover:shadow-elevated"
              >
                <div className="flex gap-6 items-start">
                  <span className="font-body text-xs font-semibold text-navy/90 pt-1.5 tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-body text-xl md:text-2xl text-navy tracking-tight group-hover:text-navy/80 transition-colors">
                      {job.title}
                    </h3>
                    <p className="mt-2.5 font-body text-[11px] font-semibold tracking-wide uppercase text-navy/90">
                      {[job.department, job.location, job.type].filter(Boolean).join("   ·   ")}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-red-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                      {job.positionsAvailable} position{job.positionsAvailable === 1 ? "" : "s"} open
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 shrink-0 items-center pl-11 sm:pl-0">
                  <Link
                    to={`/careers/${job.slug}`}
                    className="link-underline font-body text-[12px] font-semibold tracking-wide uppercase text-navy pb-1"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/careers/${job.slug}?apply=1`}
                    className="btn-fill font-body !py-2.5 !px-6 !text-xs"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Quick Apply ---------------- */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-navy-gradient p-8 md:p-10 shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-gold/30" />

            <div className="relative">
              <div className="w-10 h-[2px]  mb-5" />
              <p className="eyebrow-invert mb-3 font-body">Quick Apply</p>
              <h3 className="font-body text-2xl text-stone leading-tight mb-3 tracking-tight">
                Know the role you want?
              </h3>
              <p className="text-stone/70 text-sm leading-relaxed mb-8 font-body">
                Pick a position below and we'll take you straight to its details and
                application form.
              </p>

              <label className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-stone/50 mb-2 block">
                Position
              </label>
              <div className="relative">
                <select
                  defaultValue=""
                  onChange={handleQuickApply}
                  disabled={jobs.length === 0}
                  className="w-full appearance-none bg-stone/10 border border-stone/30 px-4 py-3.5 text-sm font-body text-stone rounded-sm focus:border-gold outline-none transition-colors disabled:opacity-40 [&>option]:text-ink"
                >
                  <option value="" disabled>
                    Select a position...
                  </option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job.slug}>
                      {job.title}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone/50 font-body text-xs">
                  ▾
                </span>
              </div>

              <div className="mt-8 pt-8 border-t border-stone/15">
                <p className="font-body text-[11px] leading-relaxed text-stone/50">
                  Don't see a fit today? Send a general application and we'll reach out
                  when something opens up.
                </p>
                <Link
                  to="/careers/general?apply=1"
                  className="link-underline  font-body text-[12px] font-semibold tracking-wide uppercase text-gold pb-1 mt-4 inline-block"
                >
                  General Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;