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

      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 bg-line/30 animate-pulse rounded-sm" />
              ))}
            </div>
          )}
          {!isLoading && jobs.length === 0 && (
            <div className="card p-10 text-center">
              <p className="text-navy/60 font-body">There are no open positions right now. Check back soon.</p>
            </div>
          )}
          {jobs.map((job, i) => (
            <div
              key={job._id}
              className={`py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${i > 0 ? "border-t border-line" : "border-t border-line"}`}
            >
              <div>
                <h3 className="font-body text-xl md:text-2xl text-navy transition-colors">{job.title}</h3>
                <p className="mt-2 font-body text-[11px] font-semibold tracking-wide uppercase text-navy/50">
                  {[job.department, job.location, job.type].filter(Boolean).join("  ·  ")}
                </p>
                <p className="mt-2 text-sm text-red-600 font-semibold font-body">
                 {job.positionsAvailable}  position{job.positionsAvailable === 1 ? "" : "s"} open
                </p>
              </div>
              <div className="flex gap-4 shrink-0 items-center">
                <Link to={`/careers/${job.slug}`} className="link-underline font-body text-[12px] font-semibold tracking-wide uppercase text-navy pb-1">
                  View Details
                </Link>
                <Link to={`/careers/${job.slug}?apply=1`} className="btn-fill font-body !py-2.5 !text-xs">Apply</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-navy-gradient p-8 shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
            <div className="relative">
              <div className="w-10 h-1 mb-4" />
              <p className="eyebrow-invert mb-3 font-body">Quick Apply</p>
              <h3 className="font-body text-2xl text-stone leading-tight mb-3">
                Know the role you want?
              </h3>
              <p className="text-stone/70 text-sm leading-relaxed mb-6 font-body">
                Pick a position and we'll take you straight to its details and application form.
              </p>
              <select
                defaultValue=""
                onChange={handleQuickApply}
                disabled={jobs.length === 0}
                className="w-full bg-stone/10 border border-stone/30 px-4 py-3 text-sm font-body text-stone rounded-sm focus:border-gold outline-none transition-colors [&>option]:text-ink"
              >
                <option value="" disabled>Select a position...</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job.slug}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
