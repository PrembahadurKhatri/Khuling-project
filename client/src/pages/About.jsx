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

      <section className="container-wide py-24 md:py-28 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6">
          <p className="eyebrow mb-3">Our Story</p>
          <h2 className="font-display text-3xl md:text-4xl text-navy leading-tight mb-5">
            Built for Nepal's infrastructure, one contract at a time.
          </h2>
          <p className="text-navy/70 leading-relaxed">
            Founded to help modernize Nepal's road and civil infrastructure, Khilung Kalika
            Construction Pvt. Ltd. has grown into a trusted partner for government and private
            clients — delivering roads, bridges, and commercial developments across the country.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-8 border-t border-line pt-8">
            <div>
              <p className="eyebrow mb-2">Mission</p>
              <p className="text-navy/70 text-sm leading-relaxed">
                Build durable, safe infrastructure that serves communities for generations, not just contract terms.
              </p>
            </div>
            <div>
              <p className="eyebrow mb-2">Vision</p>
              <p className="text-navy/70 text-sm leading-relaxed">
                Become the contractor government agencies call first when the deadline can't slip.
              </p>
            </div>
          </div>
        </div>
        <div className="md:col-span-6">
          <img
            src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=1600&auto=format&fit=crop"
            alt="Khilung Kalika engineers on site"
            className="w-full h-[420px] object-cover"
          />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="container-wide py-20">
          <p className="eyebrow mb-3">Core Values</p>
          <h2 className="font-display text-3xl md:text-4xl text-navy leading-tight mb-4 max-w-lg">
            What doesn't change between contracts.
          </h2>
          <div className="mt-8">
            {values.map(([title, desc], i) => (
              <div key={title} className={`py-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 ${i > 0 ? "border-t border-line" : "border-t border-line"}`}>
                <h3 className="font-display text-xl text-navy sm:w-64 shrink-0">{title}</h3>
                <p className="text-navy/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
