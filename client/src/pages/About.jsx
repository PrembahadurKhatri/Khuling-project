import { useQuery } from "@tanstack/react-query";
import {
  FaBullseye,
  FaEye,
  FaBuilding,
  FaUsers,
  FaHardHat,
  FaShieldAlt,
  FaThumbsUp,
  FaHandshake,
  FaCrosshairs,
  FaClock,
  FaAward,
  FaLeaf,
  FaSyncAlt,
  FaFlask,
  FaBolt,
  FaRobot,
  FaLandmark,
} from "react-icons/fa";
import { fetchSettings } from "../services/settingsService.js";
import PageHeader from "../components/PageHeader.jsx";

// Pulled straight out of the objective/research copy below — not invented,
// just surfaced as scannable pillars instead of buried in one paragraph.
const objectivePillars = [
  [FaClock, "On-Time & On-Budget", "Every project delivered against schedule and cost commitments."],
  [FaAward, "Uncompromising Quality", "Modern engineering practice, never traded for speed."],
  [FaLeaf, "Safety & Sustainability", "Environmental care and risk resilience built into every site."],
  [FaSyncAlt, "Continuous Improvement", "Research-driven refinement of how we build."],
];

const researchPillars = [
  [FaBolt, "Energy Efficiency", "Adding value to engineering products through smarter energy use."],
  [FaRobot, "Automation", "Delving into automation to sharpen precision and pace."],
  [FaLandmark, "Tradition Meets Modern", "Age-old architecture reflected in modern assets."],
];

// Below the story photo — short, scannable trust signals (icon + label).
const trustBadges = [
  [FaBuilding, "Trusted by", "Clients Across Nepal"],
  [FaShieldAlt, "Commitment to", "Quality, Safety & Environment"],
  [FaThumbsUp, "On-time", "Delivery Every Time"],
  [FaHandshake, "Long-term", "Partnerships We Value"],
];

const values = [
  ["No shortcuts on site safety", "Every site operates under documented safety protocols and monthly audits — not a poster in the site office."],
  ["Engineering sign-off, not spot checks", "A qualified engineer signs off at every structural milestone, not just at handover."],
  ["We report before you have to ask", "Weekly schedule reporting against the baseline keeps clients ahead of risk instead of surprised by it."],
  ["Building with the neighborhood in mind", "Material sourcing and site runoff are planned around the communities our sites sit in, not just the property line."],
];

const About = () => {
  const { data: settingsData } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const stats = settingsData?.data?.stats || {};

  return (
    <div>
      <PageHeader
        eyebrow="About the Firm"
        title="Fifteen years of holding the line on schedule."
        crumb="Home / About"
      />

 <section className="container-wide py-24 md:py-28 grid md:grid-cols-12 gap-14 md:gap-16 items-center">

  {/* LEFT CONTENT */}
  <div className="md:col-span-6 space-y-6">

    <div className="pt-4 space-y-3">
      <div className="flex items-center gap-3">
        <p className="eyebrow tracking-wider font-body">Our Story</p>
      
      </div>

      <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2] max-w-xl">
        Built for Nepal's infrastructure, <span className="text-gold">one contract</span> at a time.
      </h2>

  
    </div>

    <p className="text-navy/70 leading-relaxed max-w-lg text-base font-body">
Khilung Kalika Construction Pvt. Ltd. (KKCPL) was established in 2018 under the Companies Act 2063. The company provides civil and architectural construction services for projects such as hydropower, hospitals, buildings, roads, schools, colleges, and agricultural farms. With experienced engineers, skilled technicians, over 67 full-time staff and around 350 contract-based workers, KKCPL is committed to delivering high-quality, safe, and cost-effective construction projects on time while maintaining strong standards in quality, safety, and environmental management.
    </p>

    {/* MISSION / VISION */}
    <div className="mt-8 grid sm:grid-cols-2 gap-5">

      <div className="card group p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center ring-1 ring-navy/10 group-hover:ring-gold/40 group-hover:bg-gold/10 transition-all duration-300">
          <FaBullseye className="text-navy text-lg group-hover:text-gold transition-colors duration-300" />
        </div>
        <p className="text-navy font-bold mt-4 mb-2 font-body text-lg">Our Mission</p>
        <p className="text-navy/70 text-sm leading-relaxed font-body">
Our mission is to perform for our customers the highest level of quality construction services at fair and market-competitive prices. To ensure the longevity of our company through repeat and referral business achieved by customer satisfaction in all areas including timeliness, attention to detail, and service-minded attitudes.
        </p>
      </div>

      <div className="card group p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center ring-1 ring-navy/10 group-hover:ring-gold/40 group-hover:bg-gold/10 transition-all duration-300">
          <FaEye className="text-navy text-lg group-hover:text-gold transition-colors duration-300" />
        </div>
        <p className="text-navy font-bold mt-4 mb-2 font-body text-lg">Our Vision</p>
        <p className="text-navy/70 text-sm leading-relaxed font-body">
Our vision is to become a reputable and preferred civil contractor who is well known for delivering beyond the client's and project's expectations.
        </p>
      </div>

    </div>
  </div>

  {/* RIGHT IMAGE */}
  <div className="md:col-span-6">
    <div className="relative group">

      {/* soft glow background */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-gold/20 via-transparent to-navy/10 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500"></div>

      <div className="img-frame overflow-hidden rounded-2xl shadow-lg relative z-10">
        <img
          src="https://i.pinimg.com/1200x/35/23/84/352384a7a5937c38bdf830722eeb1bc0.jpg"
          alt="Khilung Kalika engineers on site"
          className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* stat bar overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-navy/90 backdrop-blur-sm">
          <div className="grid grid-cols-3 divide-x divide-white/15">
            <div className="flex items-center gap-2.5 px-3 py-4 sm:px-5">
              <FaBuilding className="text-gold text-lg sm:text-xl shrink-0" />
              <div>
                <p className="text-white font-bold text-base sm:text-lg leading-none font-body">{stats.yearsExperience || 8}+</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] font-body mt-1">Years of Excellence</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-4 sm:px-5">
              <FaUsers className="text-gold text-lg sm:text-xl shrink-0" />
              <div>
                <p className="text-white font-bold text-base sm:text-lg leading-none font-body">67+</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] font-body mt-1">Full-time Staff</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-4 sm:px-5">
              <FaHardHat className="text-gold text-lg sm:text-xl shrink-0" />
              <div>
                <p className="text-white font-bold text-base sm:text-lg leading-none font-body">350+</p>
                <p className="text-white/70 text-[10px] sm:text-[11px] font-body mt-1">Contract-based Staff</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Trust badges */}
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
      {trustBadges.map(([Icon, line1, line2]) => (
        <div key={line2} className="flex flex-col items-center text-center gap-2.5">
          <div className="w-11 h-11 rounded-lg bg-gold/10 ring-1 ring-gold/25 flex items-center justify-center">
            <Icon className="text-gold text-base" />
          </div>
          <p className="text-navy/60 text-[11px] font-body leading-tight">
            {line1}
            <br />
            <span className="text-navy font-semibold">{line2}</span>
          </p>
        </div>
      ))}
    </div>
  </div>

</section>

{/* OBJECTIVE */}
<section className="relative overflow-hidden border-t border-line">
  <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />
  <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal/5 blur-3xl pointer-events-none" />
  <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

  <div className="container-wide py-20 md:py-28 relative">
    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy/5 ring-1 ring-navy/10 mb-6">
        <FaCrosshairs className="text-navy text-xl" />
      </div>
      <p className="eyebrow tracking-wider mb-4 font-body">Our Objective</p>
      <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2] mb-3">
        Precision, on schedule, without compromise.
      </h2>

      <p className="text-navy/70 leading-relaxed text-base md:text-lg font-body">
        The primary objective of Khilung Kalika Construction Pvt. Ltd. (KKCPL) is to deliver high-quality,
        innovative, and sustainable infrastructure by combining modern engineering practices, advanced
        construction technologies, and skilled professionals. The company is committed to completing projects on
        time, within budget, and without compromising quality while promoting research, safety, environmental
        sustainability, risk resilience, and continuous improvement to support Nepal's long-term infrastructure
        development and economic growth.
      </p>
    </div>

    {/* PILLARS */}
    <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {objectivePillars.map(([Icon, title, desc]) => (
        <div
          key={title}
          className="group rounded-2xl border border-line bg-white p-5 md:p-6
                     transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-navy/20
                     hover:shadow-[0_20px_45px_rgba(10,25,47,0.10)]"
        >
          <div className="w-10 h-10 rounded-lg bg-navy/5 ring-1 ring-navy/10 flex items-center justify-center mb-4
                          group-hover:ring-gold/40 group-hover:bg-gold/10 transition-all duration-300">
            <Icon className="text-navy text-sm group-hover:text-gold transition-colors duration-300" />
          </div>
          <p className="font-body text-sm md:text-base text-navy font-semibold leading-snug mb-1.5">{title}</p>
          <p className="text-navy/60 text-xs md:text-[13px] leading-relaxed font-body">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* RESEARCH & INNOVATION */}
<section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />

  <div className="container-wide py-20 md:py-28 relative grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

    {/* LEFT — copy */}
    <div className="lg:col-span-5">
      <div className="w-14 h-14 rounded-full bg-navy/5 ring-1 ring-navy/10 flex items-center justify-center mb-6">
        <FaFlask className="text-navy text-xl" />
      </div>
      <p className="eyebrow tracking-wider font-body mb-3">Research &amp; Innovation</p>
      <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2] max-w-md mb-3">
        Where old craft meets new capability.
      </h2>
    
      <p className="text-navy/70 leading-relaxed text-base font-body max-w-lg">
        Research and innovation is one of the prime objectives of KKCPL. Thus, KKCPL shall allocate a substantial
        amount of its resources in this area. Learning from research and innovation shall be made sustainable in
        successive program activities. Research shall mainly focus on adding value to engineering products by
        adding efficiency in energy use, delving into automation, and reflecting age-old traditional architecture
        in modern assets.
      </p>
    </div>

    {/* RIGHT — pillars */}
    <div className="lg:col-span-7 grid sm:grid-cols-3 gap-5 md:gap-6">
      {researchPillars.map(([Icon, title, desc], i) => (
        <div
          key={title}
          className="group relative rounded-2xl bg-white border border-line p-6 md:p-7
                     transition-all duration-300 ease-out hover:-translate-y-1.5
                     hover:border-navy/20 hover:shadow-[0_20px_45px_rgba(10,25,47,0.10)]"
        >
          <span className="absolute left-0 top-0 h-full w-[3px] bg-navy scale-y-0 group-hover:scale-y-100
                            origin-top transition-transform duration-300" />
        
          <div className="w-11 h-11 rounded-lg bg-navy/5 ring-1 ring-navy/10 flex items-center justify-center mt-4 mb-4
                          group-hover:ring-gold/40 group-hover:bg-gold/10 transition-all duration-300">
            <Icon className="text-navy text-base group-hover:text-gold transition-colors duration-300" />
          </div>
          <p className="font-body text-base text-navy font-bold mb-2 leading-snug">{title}</p>
          <p className="text-navy/70 text-sm leading-relaxed font-body">{desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="border-t border-line  relative overflow-hidden">

  {/* subtle background texture */}
  <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />

  <div className="container-wide py-20 md:py-24 relative">

    {/* HEADER */}
    <div className="pt-4 mb-14 md:mb-16 space-y-3">
      <p className="eyebrow tracking-wider font-body">Core Values</p>

      <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2] max-w-xl">
        What doesn't change between contracts.
      </h2>
    </div>

    {/* VALUES GRID */}
    <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
      {values.map(([title, desc], i) => (
        <div
          key={title}
          className="group relative p-7 md:p-9 rounded-2xl bg-white/70 backdrop-blur-sm
                     border border-line
                     transition-all duration-300 ease-out
                     hover:-translate-y-1.5 hover:border-navy/20
                     hover:shadow-[0_20px_45px_rgba(10,25,47,0.12)]"
        >
          {/* subtle glow effect */}
          <div className="absolute inset-0 rounded-2xl font-body bg-gradient-to-tr from-gold/10 via-transparent to-navy/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

          {/* accent corner mark */}
          <div className="absolute top-0 left-7 md:left-9 w-8 h-[2px] bg-gold/60 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

          <div className="relative z-10">

            {/* index + title row */}
            <div className="flex items-start gap-4 mb-4">
            

              <h3 className="font-body text-lg md:text-xl text-navy leading-snug">
                {title}
              </h3>
            </div>

            <p className="text-navy/70 leading-relaxed text-[15px] md:text-base font-body ">
              {desc}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>
    </div>
  );
};

export default About;
