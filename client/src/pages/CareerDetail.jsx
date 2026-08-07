import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchCareerBySlug, applyToCareer } from "../services/careerService.js";
import PageHeader from "../components/PageHeader.jsx";
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
      <div className="section text-center">
        <div className="inline-block w-8 h-8 border-2 border-teal font-body border-t-transparent rounded-full animate-spin" />
        <p className="text-navy/60 mt-4">Loading...</p>
      </div>
    );
  }
  if (!data?.data) {
    return (
      <div className="section text-center">
        <p className="text-navy/60 text-lg">Position not found.</p>
      </div>
    );
  }

  const job = data.data;
  const isOpen = job.status === "open";

  const onSubmit = async (values) => {
    setApplyError("");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      if (values.coverLetter) formData.append("coverLetter", values.coverLetter);
      formData.append("resume", values.resume[0]);

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
                <input {...register("name", { required: true })} placeholder="Full Name" className="input-field" />
                <input {...register("email", { required: true })} type="email" placeholder="Email" className="input-field" />
                <input {...register("phone")} placeholder="Phone" className="input-field" />
                <div>
                  <label className="mb-2 block text-xs font-body font-semibold uppercase tracking-wide text-navy/60">CV / Resume (PDF, JPG or PNG)</label>
                  <input {...register("resume", { required: true })} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="input-field file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-navy file:text-stone file:text-xs file:font-semibold file:uppercase" />
                </div>
                <textarea {...register("coverLetter")} placeholder="Cover Letter (optional)" rows={4} className="input-field resize-none" />
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
