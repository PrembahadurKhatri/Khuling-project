import { Link } from "react-router-dom";
import { FaDraftingCompass, FaHardHat, FaTruckMoving } from "react-icons/fa";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import Seo from "../components/Seo.jsx";

const categories = [
  {
    to: "/services/design",
    icon: FaDraftingCompass,
    title: "Design",
    description: "Architectural, structural, and specialist design services — every design discipline a build needs, coordinated in one place.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop",
    accent: "navy",
  },
  {
    to: "/services/construction",
    icon: FaHardHat,
    title: "Construction",
    description: "Six disciplines under one project office — infrastructure, buildings, roads, bridges, and the full range of civil construction capability.",
    image: "/contruction.avif",
    accent: "gold",
  },
  {
    to: "/services/equipment-lease",
    icon: FaTruckMoving,
    title: "Equipment Lease",
    description: "Sixty-plus pieces of owned heavy equipment available for lease — excavators, loaders, cranes, and more.",
    image: "/eqip.avif",
    accent: "navy",
  },
];

const Services = () => (
  <div>
    <Seo
      title="Services"
      description="Design, construction, and equipment lease — the three capabilities Khilung Kalika Construction delivers under one project office."
    />
    <PageHeader eyebrow="Capability" title="What we deliver." crumb="Home / Services" />

    <section className="container-wide py-24 md:py-28 grid md:grid-cols-12 gap-x-12 gap-y-14">

      {/* LEFT SIDE */}
      <div className="md:col-span-3 md:sticky md:top-28 md:self-start space-y-6">
        <div className="pt-4 space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="font-body text-[11px] font-bold tracking-widest2 uppercase text-teal">
              Our Services
            </span>
          </div>

          <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2]">
            Tailored solutions
            <span className="block text-gold">for a stronger tomorrow.</span>
          </h2>

          <p className="text-navy/70 leading-relaxed font-body">
            We offer comprehensive construction services with a focus on quality, safety, and timely delivery. Our
            expertise covers design, construction, and equipment lease, ensuring your project is in the right hands.
          </p>

          <a
            href="#service-categories"
            className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
              border border-navy/30 text-navy
              text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
              transition-all duration-300 ease-out hover:border-navy hover:bg-navy hover:text-white"
          >
            Explore All Services
            <span className="text-base leading-none transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </a>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div id="service-categories" className="md:col-span-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {categories.map(({ to, icon: Icon, title, description, image, accent }, i) => {
          const accentBg = accent === "gold" ? "bg-gold" : "bg-navy";
          return (
            <Reveal key={to} delay={i * 0.08} variant="up">
              <Link
                to={to}
                className="group relative flex flex-col h-full rounded-2xl border border-line bg-white
                           transition-all duration-300 ease-out hover:-translate-y-1.5
                           hover:shadow-[0_20px_45px_rgba(10,25,47,0.12)]"
              >
                {/* Photo — clipped to the card's rounded top corners; the icon
                    badge below sits outside this box so it isn't clipped too */}
                <div className="relative">
                  <div className="h-44 overflow-hidden rounded-t-2xl">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {/* Icon badge, overlapping the bottom-left corner of the photo */}
                  <div
                    className={`absolute -bottom-6 left-6 w-14 h-14 rounded-xl ${accentBg} ring-4 ring-white shadow-lg
                                flex items-center justify-center z-10`}
                  >
                    <Icon className="text-white text-xl" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col pt-10 pb-6 px-6 md:px-7">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-body text-xl text-navy font-bold">{title}</h3>
                    <span className="font-body text-xs text-navy/30 tabular-nums pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-navy/70 text-sm leading-relaxed font-body flex-1">{description}</p>

                  <span className="mt-5 inline-flex items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${accentBg} text-white
                                  text-xs transition-transform duration-300 group-hover:translate-x-0.5`}
                    >
                      →
                    </span>
                    <span className="text-sm font-semibold text-navy font-body">Explore {title}</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>

    </section>
  </div>
);

export default Services;
