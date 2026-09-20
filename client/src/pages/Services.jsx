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
  },
  {
    to: "/services/construction",
    icon: FaHardHat,
    title: "Construction",
    description: "Six disciplines under one project office — infrastructure, buildings, roads, bridges, and the full range of civil construction capability.",
  },
  {
    to: "/services/equipment-lease",
    icon: FaTruckMoving,
    title: "Equipment Lease",
    description: "Sixty-plus pieces of owned heavy equipment available for lease — excavators, loaders, cranes, and more.",
  },
];

const Services = () => (
  <div>
    <Seo
      title="Services"
      description="Design, construction, and equipment lease — the three capabilities Khilung Kalika Construction delivers under one project office."
    />
    <PageHeader eyebrow="Capability" title="What we deliver." crumb="Home / Services" />

    <section className="container-wide py-24 md:py-28">
      <div className="max-w-2xl mb-14">
        <p className="eyebrow tracking-wider mb-4 font-body">Our Services</p>
        <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2]">
          Three capabilities, one project office.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map(({ to, icon: Icon, title, description }, i) => (
          <Reveal key={to} delay={i * 0.08} variant="up">
            <Link
              to={to}
              className="group relative flex flex-col h-full rounded-2xl border border-line bg-white p-7 md:p-8
                         transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-navy/20
                         hover:shadow-[0_20px_45px_rgba(10,25,47,0.10)]"
            >
              <div className="w-14 h-14 rounded-xl bg-navy/5 ring-1 ring-navy/10 flex items-center justify-center mb-6
                              group-hover:ring-gold/40 group-hover:bg-gold/10 transition-all duration-300">
                <Icon className="text-navy text-2xl group-hover:text-gold transition-colors duration-300" />
              </div>
              <h3 className="font-body text-xl md:text-2xl text-navy font-semibold mb-3">{title}</h3>
              <p className="text-navy/70 leading-relaxed font-body flex-1">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy group-hover:text-teal transition-colors duration-300 font-body">
                Explore {title}
                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  </div>
);

export default Services;
