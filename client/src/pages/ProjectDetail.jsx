import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectBySlug } from "../services/projectService.js";
import ProjectCard from "../components/ProjectCard.jsx";
import {
  HiLocationMarker,
  HiCalendar,
  HiUserGroup,
  HiCurrencyRupee,
  HiArrowLeft,
  HiArrowRight,
  HiX,
  HiOutlineArrowRight,
} from "react-icons/hi";

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4 group">
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal/10 text-teal shrink-0 transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
      <Icon className="text-lg" />
    </span>
    <div>
      <p className="font-body text-xs font-bold uppercase tracking-wider text-navy mb-0.5">{label}</p>
      <p className="font-body text-sm text-navy/90 font-medium leading-snug">{value}</p>
    </div>
  </div>
);

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
  });
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (isLoading) {
    return (
      <div>
        {/* ---------- Hero skeleton ---------- */}
        <div className="relative h-[58vh] min-h-[440px] overflow-hidden bg-stone animate-pulse">
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container-wide pb-10 pt-20 space-y-5">
              <div className="h-5 w-28 rounded-full bg-navy/10" />
              <div className="h-10 w-2/3 max-w-xl rounded bg-navy/10" />
              <div className="h-4 w-1/3 rounded bg-navy/10" />
            </div>
          </div>
        </div>

        {/* ---------- Body skeleton ---------- */}
        <section className="section grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-1/2 bg-stone rounded animate-pulse" />
            <div className="h-4 w-full bg-stone rounded animate-pulse" />
            <div className="h-4 w-full bg-stone rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-stone rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-stone rounded animate-pulse" />
          </div>

          <aside className="card p-8 h-fit space-y-6">
            <div className="h-6 w-2/3 bg-stone rounded animate-pulse" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone shrink-0 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 bg-stone rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-stone rounded animate-pulse" />
                </div>
              </div>
            ))}
          </aside>
        </section>
      </div>
    );
  }
  if (!data?.data) {
    return (
      <div className="section text-center">
        <p className="font-body text-navy/60 text-lg">Project not found.</p>
        <Link to="/projects" className="font-body inline-flex items-center gap-2 text-teal font-medium mt-4 hover:underline">
          <HiArrowLeft /> Back to projects
        </Link>
      </div>
    );
  }

  const project = data.data;
  const gallery = project.gallery ?? [];

  const showPrev = () => setLightboxIndex((i) => (i === 0 ? gallery.length - 1 : i - 1));
  const showNext = () => setLightboxIndex((i) => (i === gallery.length - 1 ? 0 : i + 1));

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <div className="relative h-[58vh] min-h-[440px] overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />

    

        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-wide pb-10 pt-20">
            <span className="badge-gold font-body mb-5 inline-block ">{project.category}</span>
            <h1 className="font-body text-3xl md:text-5xl text-stone leading-[1.1] max-w-3xl">
              {project.title}
            </h1>
            <div className="font-body flex flex-wrap gap-x-8 gap-y-2 mt-6 text-stone/80 text-sm">
              <span className="flex items-center gap-2">
                <HiLocationMarker className="text-gold font-body" /> {project.location}
              </span>
              {project.startDate && (
                <span className="flex items-center gap-2">
                  <HiCalendar className="text-gold" />
                  {new Date(project.startDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                  })}
                  {" — "}
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })
                    : "Ongoing"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Body ---------- */}
      <section className="section grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className=" pt-4 mb-6">
            <h2 className="font-body text-2xl md:text-3xl text-navy">Project Overview</h2>
          </div>
          <p className="font-body text-navy/70 leading-relaxed text-lg first-letter:font-display first-letter:text-5xl first-letter:text-teal first-letter:font-medium first-letter:mr-1 first-letter:float-left first-letter:leading-[0.85]">
            {project.description}
          </p>
        </div>

        {/* ---------- Details card ---------- */}
        <aside className="card p-8 h-fit space-y-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h3 className="font-body text-xl text-navy">Project Details</h3>
            <span className="badge-gold font-body text-xs">{project.status}</span>
          </div>

          <DetailRow icon={HiLocationMarker} label="Location" value={project.location} />
          {project.client && (
            <DetailRow icon={HiUserGroup} label="Client" value={project.client} />
          )}
          {project.budget && (
            <DetailRow icon={HiCurrencyRupee} label="Budget" value={project.budget} />
          )}
          {project.startDate && (
            <DetailRow
              icon={HiCalendar}
              label="Timeline"
              value={`${new Date(project.startDate).toLocaleDateString()} – ${
                project.endDate ? new Date(project.endDate).toLocaleDateString() : "Ongoing"
              }`}
            />
          )}

          <Link
            to="/contact"
                   className="group/btn inline-flex items-center gap-2.5 mt-6 md:mt-8
            px-5 py-2.5 rounded-full
            bg-navy text-white
            text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
            border border-navy/80 shadow-sm
            whitespace-nowrap
            transition-all duration-300 ease-out
            hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)]
            hover:-translate-y-0.5
            hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]"
          >
            Discuss a similar project <HiOutlineArrowRight />
          </Link>
        </aside>
      </section>

      {/* ---------- Related ---------- */}
      {data.related?.length > 0 && (
        <section className="section bg-paper border-t border-line relative">
          <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
          <div className="relative">
            <div className=" pt-4 mb-10">
              <h2 className="font-body text-2xl md:text-3xl text-navy">Related Projects</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.related.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Lightbox ---------- */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-6 right-6 text-stone/80 hover:text-gold transition-colors"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <HiX className="text-3xl" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-10 text-stone/70 hover:text-gold transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous photo"
              >
                <HiArrowLeft className="text-3xl" />
              </button>
              <button
                className="absolute right-4 md:right-10 text-stone/70 hover:text-gold transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next photo"
              >
                <HiArrowRight className="text-3xl" />
              </button>
            </>
          )}

          <img
            src={gallery[lightboxIndex]}
            alt={`${project.title} — photo ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <span className="font-body absolute bottom-6 text-stone/60 text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;