import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProjects } from "../services/projectService.js";
import { fetchSettings } from "../services/settingsService.js";
import { fetchTestimonials } from "../services/testimonialService.js";
import api from "../services/api.js";
import Hero from "../components/Hero.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import Counter from "../components/Counter.jsx";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

const credentials = [
  "ISO 9001:2015 Certified",
  "15+ Years in Practice",
  "Government Panel Listed",
  "120+ Projects Delivered",
];

const services = [
  {
    title: "Infrastructure & Roads",
    copy: "National highways, feeder roads, and drainage systems engineered for the terrain and the traffic they'll carry for decades.",
    image: "https://images.unsplash.com/photo-1573167243872-43c6433b9d40?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Bridges & Structures",
    copy: "Span design and heavy structural work, from feasibility through load testing, delivered with a government-panel track record.",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Commercial Buildings",
    copy: "Office, retail, and mixed-use developments — coordinated across structural, MEP, and finishing trades under one project office.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  },
];

// Shown only if no featured testimonials have been added yet in the admin panel.
const fallbackTestimonials = [
  {
    quote: "Khilung Kalika held the line on both schedule and specification through two monsoon seasons — not something we take for granted on a road contract.",
    name: "Project Director",
    org: "Regional Roads Authority",
  },
  {
    quote: "Their site engineers caught a drainage design issue before it became a rebuild. That kind of attention is why we've re-engaged them for phase two.",
    name: "Facilities Head",
    org: "Private Commercial Client",
  },
  {
    quote: "Clear weekly reporting, no surprises at handover. Exactly what a public-sector client needs from a contractor.",
    name: "Municipal Engineer",
    org: "Local Government Office",
  },
];

const fetchBlogs = async (params) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

const Home = () => {
  const { data: projectsData } = useQuery({
    queryKey: ["home-projects"],
    queryFn: () => fetchProjects({ limit: 4, status: "" }),
  });
  const { data: blogData } = useQuery({
    queryKey: ["home-blogs"],
    queryFn: () => fetchBlogs({ limit: 3 }),
  });
  const { data: settingsData } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const { data: testimonialsData } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: () => fetchTestimonials({ featured: true }),
  });

  const [tIndex, setTIndex] = useState(0);
  const projects = projectsData?.data || [];
  const posts = blogData?.data || [];
  const stats = settingsData?.data?.stats || {};
  const testimonials = testimonialsData?.data?.length
    ? testimonialsData.data.map((t) => ({ quote: t.message, name: t.name, org: [t.designation, t.company].filter(Boolean).join(", ") }))
    : fallbackTestimonials;

  return (
    <div>
      <Hero />

      {/* Credibility strip — compact, not a card grid, just a quiet row of
          facts separated by hairlines. Deliberately understated. */}
      <section className="border-b border-line bg-paper">
        <div className="container-wide py-7 flex flex-wrap items-center justify-center sm:justify-between gap-x-10 gap-y-3">
          {credentials.map((c, i) => (
            <span key={c} className={`font-mono text-[11px] tracking-wide uppercase text-navy/70 ${i > 0 ? "sm:border-l sm:border-line sm:pl-10" : ""}`}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Featured projects — asymmetric: one large case study, three lined
          up beside it rather than a uniform three-column grid. */}
      <section className="container-wide py-24 md:py-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="eyebrow mb-3">Selected Work</p>
            <h2 className="font-display text-4xl md:text-5xl text-navy max-w-xl leading-tight">
              Projects that hold up under load — literal and contractual.
            </h2>
          </div>
          <Link to="/projects" className="link-underline font-mono text-[12px] tracking-wide uppercase text-navy pb-1 shrink-0">
            View all projects →
          </Link>
        </div>

        {projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <motion.div {...fadeUp} className="lg:col-span-2">
              <ProjectCard project={projects[0]} size="lg" />
            </motion.div>
            <div className="flex flex-col gap-10">
              {projects.slice(1, 3).map((p) => (
                <motion.div {...fadeUp} key={p._id}>
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Services — alternating split rows, real photography, no icon-card
          grid. Each row breaks from the last. */}
      <section className="bg-paper">
        <div className="container-wide pt-20 pb-6">
          <p className="eyebrow mb-3">What We Do</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy max-w-xl leading-tight">
            Three disciplines, one project office.
          </h2>
        </div>

        {services.map((s, i) => (
          <div key={s.title} className={`border-t border-line ${i === services.length - 1 ? "border-b" : ""}`}>
            <div
              className={`container-wide py-14 md:py-16 grid md:grid-cols-2 gap-10 items-center ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <motion.img
                {...fadeUp}
                src={s.image}
                alt={s.title}
                className="w-full h-72 md:h-96 object-cover"
              />
              <motion.div {...fadeUp}>
                <span className="font-mono text-[11px] tracking-widest2 uppercase text-teal">
                  0{i + 1}
                </span>
                <h3 className="font-display text-3xl text-navy mt-3 mb-4">{s.title}</h3>
                <p className="text-navy/70 leading-relaxed max-w-md">{s.copy}</p>
                <Link to="/services" className="link-underline font-mono text-[12px] tracking-wide uppercase text-navy pb-1 inline-block mt-6">
                  See our approach →
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      {/* Achievements — navy band, one stat deliberately larger than the
          rest, separated by hairlines rather than equal card gutters. */}
      <section className="bg-navy py-20">
        <div className="container-wide">
          <div className="flex flex-wrap gap-x-14 gap-y-10">
            <div className="border-r border-linedark pr-14">
              <Counter value={stats.projectsCompleted || 120} label="Projects Completed" size="lg" />
            </div>
            <div className="border-r border-linedark pr-14"><Counter value={stats.yearsExperience || 15} label="Years Experience" /></div>
            <div className="border-r border-linedark pr-14"><Counter value={stats.clientsServed || 80} label="Clients Served" /></div>
            <div className="border-r border-linedark pr-14"><Counter value={stats.engineers || 45} label="Engineers on Staff" /></div>
            <div><Counter value={stats.machines || 60} label="Machines in Fleet" /></div>
          </div>
        </div>
      </section>

      {/* Why choose us — large typography, minimal imagery, editorial list
          instead of icon cards. */}
      <section className="container-wide py-24 md:py-28 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <p className="eyebrow mb-3">Why Khilung Kalika</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
            We answer for the work after the ribbon is cut.
          </h2>
        </div>
        <div className="md:col-span-7 md:pt-3">
          {[
            ["Site discipline", "Daily safety briefings and a documented QA process on every active site, audited monthly."],
            ["Transparent reporting", "Clients get weekly progress reports against the baseline schedule — not just at milestones."],
            ["In-house fleet", "Sixty-plus pieces of owned heavy equipment mean fewer schedule risks tied to rented plant."],
            ["Government-panel standing", "Listed and vetted for public infrastructure tender across multiple provinces."],
          ].map(([title, copy], i) => (
            <motion.div
              {...fadeUp}
              key={title}
              className={`py-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <h3 className="font-display text-xl text-navy sm:w-56 shrink-0">{title}</h3>
              <p className="text-navy/70 leading-relaxed">{copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials — one featured quote at a time, not a card carousel. */}
      <section className="bg-stone border-y border-line py-24">
        <div className="container-wide max-w-3xl">
          <p className="eyebrow mb-8">Client Record</p>
          <motion.blockquote
            key={tIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-serif italic text-2xl md:text-3xl text-navy leading-snug"
          >
            “{testimonials[tIndex].quote}”
          </motion.blockquote>
          <div className="mt-8 flex items-center justify-between">
            <p className="font-mono text-[12px] tracking-wide uppercase text-navy/60">
              {testimonials[tIndex].name} — {testimonials[tIndex].org}
            </p>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIndex(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 w-6 transition-colors ${i === tIndex ? "bg-gold" : "bg-line"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest news — one large feature, two minor items. */}
      {posts.length > 0 && (
        <section className="container-wide py-24 md:py-28">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-3">From the Journal</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">Latest news</h2>
            </div>
            <Link to="/blog" className="link-underline font-mono text-[12px] tracking-wide uppercase text-navy pb-1 shrink-0">
              Read the journal →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <Link to={`/blog/${posts[0].slug}`} className="group block">
              <div className="overflow-hidden aspect-[16/10]">
                <img src={posts[0].featuredImage} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              </div>
              <p className="eyebrow mt-5">{posts[0].category}</p>
              <h3 className="font-display text-2xl text-navy mt-1 link-underline inline">{posts[0].title}</h3>
              <p className="text-navy/60 mt-2 text-sm max-w-md">{posts[0].excerpt}</p>
            </Link>
            <div className="flex flex-col gap-8">
              {posts.slice(1, 3).map((post) => (
                <Link key={post._id} to={`/blog/${post.slug}`} className="group flex gap-5 border-t border-line pt-8 first:border-t-0 first:pt-0">
                  <div className="w-28 h-20 shrink-0 overflow-hidden">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="eyebrow">{post.category}</p>
                    <h4 className="font-display text-lg text-navy mt-1 link-underline inline">{post.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA — split band, not a centered box. */}
      <section className="bg-navy grid md:grid-cols-2">
        <div className="py-20 px-6 md:px-10 flex flex-col justify-center">
          <p className="eyebrow-invert mb-4">Start a Project</p>
          <h2 className="font-display text-4xl md:text-5xl text-stone leading-tight max-w-md">
            Tell us what you're building. We'll tell you what it takes.
          </h2>
          <div className="mt-8">
            <Link to="/contact" className="btn-line-invert">Request a Quote</Link>
          </div>
        </div>
        <div className="relative min-h-[280px]">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
            alt="Engineers reviewing site plans"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
