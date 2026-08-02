import { useQuery } from "@tanstack/react-query";
import api from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";

const fetchServices = async () => {
  const { data } = await api.get("/services");
  return data;
};

const Services = () => {
  const { data, isLoading } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const services = data?.data || [];

  return (
    <div>
      <PageHeader
        eyebrow="Capability"
        title="Six disciplines under one project office."
        crumb="Home / Services"
      />

      {/* Asymmetric split: a fixed intro column beside a running editorial
          list — not a uniform card grid, and it scales to any number of
          services without repeating a card treatment N times. */}
      <section className="container-wide py-24 md:py-28 grid md:grid-cols-12 gap-x-10 gap-y-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">What We Deliver</p>
          <h2 className="font-display text-3xl md:text-4xl text-navy leading-tight max-w-xs">
            Each discipline runs its own site office, under one project management structure.
          </h2>
        </div>

        <div className="md:col-span-8">
          {isLoading ? (
            <p className="text-navy/60">Loading services...</p>
          ) : services.length ? (
            services.map((service, i) => (
              <div
                key={service._id}
                className={`py-9 flex flex-col sm:flex-row gap-6 sm:gap-10 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <span className="font-mono text-[13px] text-teal shrink-0 sm:w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {service.heroImage && (
                  <img
                    src={service.heroImage}
                    alt={service.title}
                    className="w-full sm:w-36 h-28 object-cover shrink-0"
                  />
                )}
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-navy">{service.title}</h3>
                  <p className="mt-2 text-navy/70 leading-relaxed max-w-lg">{service.shortDescription}</p>
                  {service.benefits?.length > 0 && (
                    <p className="mt-4 font-mono text-[11px] tracking-wide uppercase text-navy/50">
                      {service.benefits.join("  ·  ")}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-navy/60">No services listed yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
