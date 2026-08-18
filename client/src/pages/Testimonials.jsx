import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "../services/testimonialService.js";
import PageHeader from "../components/PageHeader.jsx";
import Seo from "../components/Seo.jsx";
import { HiStar } from "react-icons/hi";

const Stars = ({ rating }) => (
  <div className="flex gap-0.5 text-gold">
    {Array.from({ length: 5 }).map((_, i) => (
      <HiStar key={i} className={i < rating ? "opacity-100" : "opacity-20"} size={14} />
    ))}
  </div>
);

const Testimonials = () => {
  const { data, isLoading } = useQuery({ queryKey: ["testimonials"], queryFn: () => fetchTestimonials() });
  const testimonials = data?.data || [];

  return (
    <div>
      <Seo title="Testimonials" description="What it's like working with us — client voices from across our completed and ongoing projects." />
      <PageHeader
        eyebrow="Client Voices"
        title="What it's like working with us."
        crumb="Home / Testimonials"
      />

      <section className="container-wide py-24 md:py-28">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 bg-line/30 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : testimonials.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t._id} className="rounded-xl border border-navy/10 bg-white shadow-soft p-6 flex flex-col">
                <Stars rating={t.rating} />
                <p className="font-body text-navy/80 leading-relaxed mt-4 flex-1">"{t.message}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-line">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-navy/10 flex items-center justify-center font-body font-semibold text-navy">
                      {t.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-body font-semibold text-navy text-sm">{t.name}</p>
                    <p className="font-body text-navy/50 text-xs">
                      {[t.designation, t.company].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-navy/60 text-lg">No testimonials yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Testimonials;
