import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchServices } from "../services/serviceService.js";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";

const COPY = {
  construction: {
    seoTitle: "Construction Services",
    seoDescription: "Six disciplines under one project office — infrastructure, buildings, roads, bridges, and the full range of civil construction capability.",
    eyebrow: "Capability",
    title: "Six disciplines under one project office.",
    kicker: "What We Deliver",
    intro: "Each discipline runs its own site office, under one project management structure.",
  },
  design: {
    seoTitle: "Design Services",
    seoDescription: "Architectural, structural, and specialist design services for every stage of a build, from concept through to construction-ready drawings.",
    eyebrow: "Capability",
    title: "Design work that construction can actually build from.",
    kicker: "What We Design",
    intro: "Every design discipline a project needs, coordinated under one project office instead of scattered across consultants.",
  },
};

const ServiceList = ({ group }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["services", group],
    queryFn: () => fetchServices({ group }),
  });
  const services = data?.data || [];
  const copy = COPY[group];

  return (
    <div>
      <Seo title={copy.seoTitle} description={copy.seoDescription} />
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} crumb={`Home / Services / ${group === "design" ? "Design" : "Construction"}`} />

      <section className="container-wide py-24 md:py-28 grid md:grid-cols-12 gap-x-12 gap-y-14">

        {/* LEFT SIDE */}
        <div className="md:col-span-4 md:sticky md:top-28 md:self-start space-y-8">
          <div className="pt-4 space-y-6">
            <div className="flex items-baseline gap-3">
              <span className="font-body text-[11px] font-bold tracking-widest2 uppercase text-teal">
                {copy.kicker}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2] max-w-sm">
              {copy.intro}
            </h2>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-teal transition-colors duration-300 font-body"
            >
              ← All service categories
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:col-span-8">
          {isLoading ? (
            <div className="space-y-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-line/30 animate-pulse rounded-md" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="text-navy/60 font-body">No {group} services added yet.</p>
          ) : (
            <div className="relative">
              {/* Connecting spine — reinforces "one project office" across disciplines */}
              <div className="absolute left-[27px] top-2 bottom-2 w-px bg-line hidden sm:block" />

              <div className="space-y-2">
                {services.map((service, i) => (
                  <Reveal key={service._id} delay={(i % 6) * 0.06} variant={i % 2 === 0 ? "left" : "right"}>
                  <div
                    className={`relative py-9 flex flex-col sm:flex-row gap-6 sm:gap-8 group transition-all duration-300 ${
                      i > 0 ? "border-t border-line" : ""
                    }`}
                  >
                    {/* Index — set like a drawing sheet number, e.g. S.01 */}
                    <div className="hidden sm:flex flex-col items-center shrink-0 w-14">
                      <span className="font-body text-[13px] font-bold text-white bg-navy group-hover:bg-teal transition-colors duration-300 w-9 h-9 rounded-full flex items-center justify-center relative z-10 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                    </div>

                    {service.heroImage && (
                      <div className="relative w-full sm:w-44 h-32 shrink-0">
                        <div className="img-frame w-full h-full overflow-hidden rounded-lg">
                          <img
                            src={service.heroImage}
                            alt={service.title}
                            className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex-1 space-y-2.5">

                      <h3 className="font-body text-xl md:text-2xl text-navy transition-colors duration-300 group-hover:text-teal">
                        {service.title}
                      </h3>

                      <p className="text-navy/70 leading-relaxed max-w-lg font-body">
                        {service.shortDescription}
                      </p>

                      {service.benefits?.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {service.benefits.map((b) => (
                            <span key={b} className="badge-navy font-body">
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {service.category && (
                        <div className="pt-3">
                          <Link
                            to={`/projects?category=${encodeURIComponent(service.category)}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-navy transition-colors duration-300 font-body"
                          >
                            <span   className="group/btn inline-flex items-center gap-2.5 mt-6 md:mt-8
            px-5 py-2.5 rounded-full
            bg-navy text-white
            text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
            border border-navy/80 shadow-sm
            whitespace-nowrap
            transition-all duration-300 ease-out
            hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)]
            hover:-translate-y-0.5
            hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]">
                              Related Projects
                              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-current group-hover:w-full transition-all duration-300" />
                            </span>

                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="hidden md:flex items-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">

                    </div>
                  </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
};

export default ServiceList;
