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
} from "react-icons/hi";

const CareerDetail = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["career", slug],
    queryFn: () => fetchCareerBySlug(slug),
  });
  // Arriving via the "Apply" / Quick Apply links (?apply=1) should land
  // straight on an open application form instead of requiring another click.
  const [applying, setApplying] = useState(searchParams.get("apply") === "1");
  const [applyError, setApplyError] = useState("");
  const applyFormRef = useRef(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    if (applying) applyFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [applying]);

  if (isLoading) return <p className="section text-center text-gray-500">Loading...</p>;
  if (!data?.data) return <p className="section text-center text-gray-500">Position not found.</p>;

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
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
            {isOpen ? "Open" : "Closed"}
          </span>
          {isOpen && (
            <button onClick={() => setApplying(true)} className="btn-primary !py-2 shrink-0">Apply Now</button>
          )}
        </div>
      </div>

      <section className="section grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-xl font-heading font-bold text-secondary mb-3">Job Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {job.qualifications?.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-secondary mb-3">Qualifications</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-bold text-secondary mb-3">Other Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {applying && (
            <div ref={applyFormRef} className="card p-6 max-w-lg scroll-mt-28">
              <h3 className="font-heading font-semibold text-lg text-secondary mb-4">Apply for {job.title}</h3>
              {applyError && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{applyError}</p>}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input {...register("name", { required: true })} placeholder="Full Name" className="w-full border rounded-lg px-3 py-2" />
                <input {...register("email", { required: true })} type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" />
                <input {...register("phone")} placeholder="Phone" className="w-full border rounded-lg px-3 py-2" />
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">CV / Resume (PDF, JPG or PNG)</label>
                  <input {...register("resume", { required: true })} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="w-full border rounded-lg px-3 py-2" />
                </div>
                <textarea {...register("coverLetter")} placeholder="Cover Letter (optional)" rows={4} className="w-full border rounded-lg px-3 py-2" />
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          )}
        </div>

        <aside className="card p-6 h-fit space-y-4">
          <h3 className="font-heading font-semibold text-secondary">Position Details</h3>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineUserGroup className="text-primary shrink-0" />
            {job.positionsAvailable} position{job.positionsAvailable === 1 ? "" : "s"} open
          </div>
          {job.department && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiOfficeBuilding className="text-primary shrink-0" /> {job.department}
            </div>
          )}
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiLocationMarker className="text-primary shrink-0" /> {job.location}
            </div>
          )}
          {job.type && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiBriefcase className="text-primary shrink-0" /> {job.type}
            </div>
          )}
          {job.experience && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiUserGroup className="text-primary shrink-0" /> {job.experience} experience
            </div>
          )}
          {job.ageRequirement && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiCalendar className="text-primary shrink-0" /> Age: {job.ageRequirement}
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiCurrencyDollar className="text-primary shrink-0" /> {job.salary}
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-line">
              Apply before <span className="font-semibold text-ink">{new Date(job.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default CareerDetail;
