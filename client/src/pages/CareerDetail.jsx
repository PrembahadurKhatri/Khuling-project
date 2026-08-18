import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchCareerBySlug, applyToCareer } from "../services/careerService.js";
import PageHeader from "../components/PageHeader.jsx";
import Seo from "../components/Seo.jsx";
import ApplicationFormFields from "../components/ApplicationFormFields.jsx";
import {
  HiLocationMarker,
  HiOfficeBuilding,
  HiBriefcase,
  HiCurrencyDollar,
  HiUserGroup,
  HiCalendar,
  HiOutlineUserGroup,
  HiCurrencyRupee,
} from "react-icons/hi";

const CareerDetail = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["career", slug],
    queryFn: () => fetchCareerBySlug(slug),
  });
  const [applying, setApplying] = useState(searchParams.get("apply") === "1");
  const [applyError, setApplyError] = useState("");
  const applyFormRef = useRef(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (applying) applyFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [applying]);

  if (isLoading) {
    return (
      <div>
        <div className="section !pb-0 !pt-16 space-y-4">
          <div className="h-3 w-40 bg-stone rounded-full animate-pulse" />
          <div className="h-10 w-2/3 max-w-lg bg-stone rounded animate-pulse" />
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="h-6 w-20 bg-stone rounded-full animate-pulse" />
            <div className="h-9 w-28 bg-stone rounded-sm animate-pulse" />
          </div>
        </div>

        <section className="section grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="h-6 w-1/3 bg-stone rounded animate-pulse" />
              <div className="h-4 w-full bg-stone rounded animate-pulse" />
              <div className="h-4 w-full bg-stone rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-stone rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-6 w-1/3 bg-stone rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-stone rounded animate-pulse" />
            </div>
          </div>

          <aside className="card p-8 h-fit space-y-5">
            <div className="h-6 w-2/3 bg-stone rounded animate-pulse border-b border-line pb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-stone rounded animate-pulse" />
            ))}
          </aside>
        </section>
      </div>
    );
  }
  if (!data?.data) {
    return (
      <div className="section text-center">
        <Seo title="Position Not Found" noindex />
        <p className="text-navy/60 text-lg">Position not found.</p>
      </div>
    );
  }

  const job = data.data;
  const jobDescription = job.description?.length > 160 ? `${job.description.slice(0, 157)}...` : job.description;
  const isOpen = job.status === "open";

  const onSubmit = async (values) => {
    setApplyError("");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      formData.append("resume", values.resume[0]);
      if (values.coverLetter?.[0]) formData.append("coverLetter", values.coverLetter[0]);
      if (values.links?.github) formData.append("links.github", values.links.github);
      if (values.links?.linkedin) formData.append("links.linkedin", values.links.linkedin);
      if (values.links?.other) formData.append("links.other", values.links.other);

      await applyToCareer(job._id, formData);
      reset();
      setApplying(false);
      alert("Application submitted successfully!");
    } catch (err) {
      setApplyError(err.response?.data?.message || "Something went wrong submitting your application. Please try again.");
    }
  };

  return (
    <div>
      {/* Closed positions are excluded from the sitemap too — keep them out
          of search results once they stop being an active opening. */}
      <Seo title={job.title} description={jobDescription} noindex={!isOpen} />
      <PageHeader
        eyebrow={[job.department, job.location, job.type].filter(Boolean).join(" · ") || "Careers"}
        title={job.title}
        crumb="Home / Careers"
      />

      <div className="section !pb-0 !pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className={isOpen ? "badge-teal" : "badge-navy"}>
            {isOpen ? "Open" : "Closed"}
          </span>
          {isOpen && (
            <button onClick={() => setApplying(true)} className="btn-fill !py-2.5 !text-xs shrink-0">Apply Now</button>
          )}
        </div>
      </div>

      <section className="section grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="font-body text-xl text-navy mb-4">Job Description</h2>
            <p className="text-navy/80 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.qualifications?.length > 0 && (
            <div>
              <h2 className="font-body text-xl text-navy mb-4">Qualifications</h2>
              <ul className="list-disc pl-5 space-y-2 text-navy/80">
                {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div>
              <h2 className="font-body text-xl text-navy mb-4">Other Requirements</h2>
              <ul className="list-disc pl-5 space-y-2 text-navy/80">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {applying && (
            <div ref={applyFormRef} className="card p-8 max-w-lg scroll-mt-28">
              <h3 className="font-body text-xl text-navy mb-6">Apply for {job.title}</h3>
              {applyError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">{applyError}</div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <ApplicationFormFields register={register} />
                <button type="submit" disabled={isSubmitting} className="btn-fill w-full justify-center">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          )}
        </div>

        <aside className="card p-8 h-fit space-y-5 lg:sticky lg:top-28">
          <h3 className="font-body text-xl text-navy border-b border-line pb-4">Position Details</h3>

          <div className="flex items-start gap-3 text-sm text-navy/80">
            <HiOutlineUserGroup className="text-navy text-lg shrink-0 mt-0.5" />
            {job.positionsAvailable} position{job.positionsAvailable === 1 ? "" : "s"} open
          </div>
          {job.department && (
            <div className="flex items-start gap-3 text-sm text-navy/80">
              <HiOfficeBuilding className="text-navy text-lg shrink-0 mt-0.5" /> {job.department}
            </div>
          )}
          {job.location && (
            <div className="flex items-start gap-3 text-sm text-navy/80">
              <HiLocationMarker className="text-navy text-lg shrink-0 mt-0.5" /> {job.location}
            </div>
          )}
          {job.type && (
            <div className="flex items-start gap-3 text-sm text-navy/80">
              <HiBriefcase className="text-navy text-lg shrink-0 mt-0.5" /> {job.type}
            </div>
          )}
          {job.experience && (
            <div className="flex items-start gap-3 text-sm text-navy/80">
              <HiUserGroup className="text-navy text-lg shrink-0 mt-0.5" /> {job.experience} experience
            </div>
          )}
          {job.ageRequirement && (
            <div className="flex items-start gap-3 text-sm text-navy/80">
              <HiCalendar className="text-navy text-lg shrink-0 mt-0.5" /> Age: {job.ageRequirement}
            </div>
          )}
          {job.salary && (
            <div className="flex items-start gap-3 text-sm text-navy/80">
              <HiCurrencyRupee className="text-navy l text-lg shrink-0 mt-0.5" /> {job.salary}
            </div>
          )}
          {job.deadline && (
            <div className="flex items-start gap-3 text-sm text-navy/80 pt-4 border-t border-line">
              Apply before <span className="font-semibold text-red-600">{new Date(job.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default CareerDetail;
