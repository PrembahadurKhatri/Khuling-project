import PageHeader from "../components/PageHeader.jsx";

const values = [
  ["No shortcuts on site safety", "Every site operates under documented safety protocols and monthly audits — not a poster in the site office."],
  ["Engineering sign-off, not spot checks", "A qualified engineer signs off at every structural milestone, not just at handover."],
  ["We report before you have to ask", "Weekly schedule reporting against the baseline keeps clients ahead of risk instead of surprised by it."],
  ["Building with the neighborhood in mind", "Material sourcing and site runoff are planned around the communities our sites sit in, not just the property line."],
];

const About = () => {
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
    
    <div className=" pt-4 space-y-3">
      <p className="eyebrow tracking-wider font-body">Our Story</p>

      <h2 className="font-body text-3xl md:text-4xl text-navy leading-[1.2] max-w-xl">
        Built for Nepal's infrastructure, one contract at a time.
      </h2>
    </div>

    <p className="text-navy/70 leading-relaxed max-w-lg text-lg font-body">
      Founded to help modernize Nepal's road and civil infrastructure, Khilung Kalika
      Construction Pvt. Ltd. has grown into a trusted partner for government and private
      clients — delivering roads, bridges, and commercial developments across the country.
    </p>

    {/* MISSION / VISION */}
    <div className="mt-8 grid sm:grid-cols-2 gap-5">
      
      <div className="card p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <p className="text-navy font-bold mb-2 font-body text-lg hover:">Mission</p>
        <p className="text-navy/70 text-sm leading-relaxed font-body">
          Build durable, safe infrastructure that serves communities for generations, not just contract terms.
        </p>
      </div>

      <div className="card p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <p className="text-navy font-bold mb-2 text-lg">Vision</p>
        <p className="text-navy/70 text-sm leading-relaxed">
          Become the contractor government agencies call first when the deadline can't slip.
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
      </div>

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

            <p className="text-navy/70 leading-relaxed text-[15px] md:text-base font-body pl-9 md:pl-9">
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
