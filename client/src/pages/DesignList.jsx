import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDesigns } from "../services/designService.js";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";

const DesignList = () => {
  const { data, isLoading } = useQuery({ queryKey: ["designs"], queryFn: fetchDesigns });
  const designs = data?.data || [];

  return (
    <div>
      <Seo
        title="Design Services"
        description="Architectural, structural, and specialist design services for every stage of a build, from concept through to construction-ready drawings."
      />
      <PageHeader eyebrow="Capability" title="Design work that construction can actually build from." crumb="Home / Services / Design" />

      <section className="container-wide py-24 md:py-28">
        <div className="max-w-2xl mb-14">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-teal transition-colors duration-300 font-body mb-6"
          >
            ← All service categories
          </Link>
          <p className="eyebrow tracking-wider mb-4 font-body">What We Design</p>
          <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2]">
            Every design discipline a project needs.
          </h2>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 bg-line/30 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <p className="text-navy/60 font-body">No design services added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {designs.map((item, i) => (
              <Reveal key={item._id} delay={(i % 6) * 0.06} variant="up">
                <div className="group rounded-2xl border border-line bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/20 hover:shadow-[0_20px_45px_rgba(10,25,47,0.10)]">
                  {item.images?.[0] ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {item.category && (
                        <span className="absolute top-3 right-3 rounded-full bg-navy/90 text-white text-[11px] font-body font-semibold px-3 py-1">
                          {item.category}
                        </span>
                      )}
                      {item.images.length > 1 && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-[11px] font-body font-semibold px-2.5 py-1">
                          +{item.images.length - 1} photo{item.images.length > 2 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-navy/5 flex items-center justify-center text-navy/20 font-body text-sm">
                      No image
                    </div>
                  )}
                  <div className="p-5 md:p-6">
                    <h3 className="font-body text-lg text-navy font-semibold mb-1.5">{item.name}</h3>
                    {item.description && (
                      <p className="text-navy/70 text-sm leading-relaxed font-body">{item.description}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DesignList;
