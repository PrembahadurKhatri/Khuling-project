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

      {/* Split: open positions run as an editorial list on the left; the
          quick-apply tool gets a solid navy panel of its own, not a matching
          rounded card beside it. */}
      <section className="container-wide py-24 md:py-28 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {isLoading && <p className="text-navy/60">Loading open positions...</p>}
          {!isLoading && jobs.length === 0 && (
            <p className="text-navy/60">There are no open positions right now. Check back soon.</p>
          )}
          {jobs.map((job, i) => (
            <div
              key={job._id}
              className={`py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${i > 0 ? "border-t border-line" : "border-t border-line"}`}
            >
              <div>
                <h3 className="font-display text-xl md:text-2xl text-navy">{job.title}</h3>
                <p className="mt-1 font-mono text-[11px] tracking-wide uppercase text-navy/50">
                  {[job.department, job.location, job.type].filter(Boolean).join("  ·  ")}
                </p>
                <p className="mt-2 text-sm text-teal font-medium">
                  {job.positionsAvailable} position{job.positionsAvailable === 1 ? "" : "s"} open
                </p>
              </div>
              <div className="flex gap-6 shrink-0 items-center">
                <Link to={`/careers/${job.slug}`} className="link-underline font-mono text-[12px] tracking-wide uppercase text-navy pb-1">
                  View Details
                </Link>
                <Link to={`/careers/${job.slug}?apply=1`} className="btn-fill !py-2.5">Apply</Link>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-navy p-8 h-fit">
            <p className="eyebrow-invert mb-3">Quick Apply</p>
            <h3 className="font-display text-2xl text-stone leading-tight mb-3">
              Know the role you want?
            </h3>
            <p className="text-stone/70 text-sm leading-relaxed mb-6">
              Pick a position and we'll take you straight to its details and application form.
            </p>
            <select
              defaultValue=""
              onChange={handleQuickApply}
              disabled={jobs.length === 0}
              className="w-full bg-transparent border border-stone/30 px-3 py-2.5 text-sm text-stone [&>option]:text-ink"
            >
              <option value="" disabled>Select a position...</option>
              {jobs.map((job) => (
                <option key={job._id} value={job.slug}>{job.title}</option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
