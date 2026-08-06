import {useEffect, useState } from "react";
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
const values = [
  ["No shortcuts on site safety", "Every site operates under documented safety protocols and monthly audits — not a poster in the site office."],
  ["Engineering sign-off, not spot checks", "A qualified engineer signs off at every structural milestone, not just at handover."],
  ["We report before you have to ask", "Weekly schedule reporting against the baseline keeps clients ahead of risk instead of surprised by it."],
  ["Building with the neighborhood in mind", "Material sourcing and site runoff are planned around the communities our sites sit in, not just the property line."],
];

const services = [
  {
    title: "Infrastructure & Roads",
    copy: "National highways, feeder roads, and drainage systems engineered for the terrain and the traffic they'll carry for decades.",
    image: "https://t3.ftcdn.net/jpg/16/59/89/86/360_F_1659898677_Cl3XpPSK3OiAc0Dd9jCdMhWgQPJRoUaz.jpg",
  },
  {
    title: "Bridges & Structures",
    copy: "Span design and heavy structural work, from feasibility through load testing, delivered with a government-panel track record.",
    image: "https://media.istockphoto.com/id/518234296/photo/garden-bridge-of-shanghai.jpg?s=612x612&w=0&k=20&c=aNJtAHUJvY8EA90fi9ESm3evpQM8Ftq_GKAmVz7FBkA=",
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
useEffect(() => {
  const interval = setInterval(() => {
    setTIndex((prev) => (prev + 1) % testimonials.length);
  }, 3000);

  return () => clearInterval(interval);
}, [testimonials.length]);
  return (
    <div>
      <Hero />

      {/* Credibility strip */}
<section
  id="content-start"
  className="border-b border-line bg-paper"
>
  <div className="container-wide py-5 sm:py-8">

    <div className="flex flex-wrap justify-center sm:justify-between gap-2 sm:gap-4">

      {credentials.map((c) => (
        <span
          key={c}
          className="flex items-center gap-1.5 px-2.5 py-1 
          sm:px-4 sm:py-2 sm:gap-2
          rounded-full bg-white border border-line shadow-sm
          text-[10px] sm:text-[12px] font-body font-semibold tracking-wide uppercase text-navy/80"
        >
          {/* indicator */}
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal shrink-0" />

          {/* text */}
          <span className="whitespace-nowrap font-body">{c}</span>
        </span>
      ))}

    </div>

  </div>
</section>
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

<section className="container-wide py-20 md:py-28">

  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 md:mb-16 gap-6 border-b border-line pb-8">

    <div className="font-body max-w-xl">
      <p className="eyebrow mb-3  tracking-[0.18em]">Selected Work</p>

      <h2 className="section-title font-body leading-[1.15]">
        Projects that hold up under load
        <span className="block text-navy/50 text-[0.55em] font-medium font-body mt-2 tracking-normal">
          — literal and contractual.
        </span>
      </h2>
    </div>

    <div className="flex justify-start sm:justify-end w-full sm:w-auto">
      <Link
        to="/projects"
        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
        bg-navy hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)] text-white 
        text-[12px] font-body font-semibold tracking-wide uppercase
        border border-navy/80 shadow-sm hover:shadow-md
        transition-all duration-300
        whitespace-nowrap"
      >
        View all projects
        <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>

  </div>

  {/* Projects Layout */}
  {projects.length > 0 && (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

      <div className="lg:col-span-2 lg:row-span-2">
        <div className="h-full rounded-2xl overflow-hidden border border-line bg-white shadow-sm 
          hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <ProjectCard project={projects[0]} size="lg" />
        </div>
      </div>

      {/* Side Projects */}
      <div className="flex flex-col gap-6 md:gap-8">
        {projects.slice(1, 3).map((p) => (
          <div
            key={p._id}
            className="rounded-2xl overflow-hidden border border-line bg-white shadow-sm
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

    </div>
  )}

</section>
     
    <section className="relative overflow-hidden">

  {/* subtle background texture */}
  <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />

  {/* Header */}
  <div className="container-wide pt-16 md:pt-20 pb-6 relative">
    <div className="pt-2 sm:pt-4">
      <p className="eyebrow mb-3 font-body">What We Do</p>

      <h2 className="section-title max-w-xl font-body">
        Three disciplines, one project office.
      </h2>
    </div>
  </div>

  {/* Services */}
  {services.map((s, i) => (
    <div
      key={s.title}
      className={`border-t border-line relative group/row ${
        i === services.length - 1 ? "border-b" : ""
      }`}
    >
      <div
        className={`container-wide py-12 md:py-20 grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
          i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden border border-line bg-white shadow-[0_8px_30px_rgba(10,25,47,0.08)] group">
          <div className="aspect-[4/3] md:aspect-auto md:h-96">
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </div>

          {/* depth overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/25 via-transparent to-transparent pointer-events-none" />

        
        </div>

        {/* Content */}
        <div className="max-w-md">

        

          {/* Title */}
          <h3 className="font-body text-2xl md:text-3xl text-navy mb-3 md:mb-4 leading-tight tracking-tight">
            {s.title}
          </h3>

          {/* Description */}
          <p className="text-navy/70 leading-relaxed text-sm md:text-base font-body">
            {s.copy}
          </p>

          {/* CTA Button */}
          <Link
            to="/services"
            className="group/btn inline-flex items-center gap-2.5 mt-6 md:mt-8
            px-5 py-2.5 rounded-full
            bg-navy text-white
            text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
            border border-navy/80 shadow-sm
            whitespace-nowrap
            transition-all duration-300 ease-out
            hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)]
            hover:-translate-y-0.5
            hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]"
          >
            See our approach
            <span className="text-base leading-none transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
              →
            </span>
          </Link>

        </div>

      </div>
    </div>
  ))}

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
      {/* Achievements — navy band, one stat deliberately larger than the
          rest, separated by hairlines rather than equal card gutters. */}
      <section className="bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
        <div className="container-wide relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-0">
            <div className="lg:border-r lg:border-linedark lg:pr-8 font-body">
              <Counter value={stats.projectsCompleted || 120} label="Projects Completed" size="lg" />
            </div>
            <div className="lg:border-r lg:border-linedark font-body lg:px-8"><Counter value={stats.yearsExperience || 15} label="Years Experience" /></div>
            <div className="lg:border-r lg:border-linedark font-body lg:px-8"><Counter value={stats.clientsServed || 80} label="Clients Served" /></div>
            <div className="lg:border-r lg:border-linedark font-body lg:px-8"><Counter value={stats.engineers || 45} label="Engineers on Staff" /></div>
            <div className="lg:pl-8 font-body"><Counter value={stats.machines || 60} label="Machines in Fleet" /></div>
          </div>
        </div>
      </section>

      {/* Why choose us — large typography, minimal imagery, editorial list
          instead of icon cards. */}
    <section className="container-wide py-20 md:py-28 grid md:grid-cols-12 gap-10 md:gap-16">

  {/* Left Content */}
  <div className="md:col-span-4 flex flex-col justify-start font-body md:sticky md:top-24 md:self-start">
    <p className="eyebrow mb-3">Why Khilung Kalika</p>

    <h2 className="section-title leading-tight font-body">
      We answer for the work after the ribbon is cut.
    </h2>
  </div>

  {/* Right Content */}
  <div className="md:col-span-8 grid sm:grid-cols-2 gap-5 md:gap-6 font-body">

    {[
      ["Site discipline", "Daily safety briefings and a documented QA process on every active site, audited monthly."],
      ["Transparent reporting", "Clients get weekly progress reports against the baseline schedule — not just at milestones."],
      ["In-house fleet", "Sixty-plus pieces of owned heavy equipment mean fewer schedule risks tied to rented plant."],
      ["Government-panel standing", "Listed and vetted for public infrastructure tender across multiple provinces."],
    ].map(([title, copy], i) => (

      <div
        key={title}
        tabIndex={0}
        className="group relative flex gap-4 p-7 md:p-9 rounded-2xl bg-white/70 backdrop-blur-sm
        border border-line font-body overflow-hidden

        transition-all duration-300 ease-out

        hover:-translate-y-1.5 hover:border-navy/20
        hover:shadow-[0_20px_45px_rgba(10,25,47,0.12)]

        active:scale-[0.98]

        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40"
      >

        {/* subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl font-body bg-gradient-to-tr from-gold/10 via-transparent to-navy/5 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />

        {/* accent corner mark */}
        <div className="absolute top-0 left-7 md:left-9 w-8 h-[2px] bg-gold/60 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

     
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-lg text-navy mb-1.5
            transition-colors duration-300 font-body
            hover:border-navy/20">
            {title}
          </h3>

          <p className="text-navy/70 text-sm leading-relaxed font-body">
            {copy}
          </p>
        </div>

      </div>

    ))}

  </div>

</section>

      {/* Testimonials — one featured quote at a time, not a card carousel. */}
      <section className=" to-stone border-y border-line py-20 md:py-24 relative overflow-hidden">
  <div className="absolute inset-0 bg-hero-pattern opacity-15 pointer-events-none" />
  <div className="container-wide max-w-3xl relative text-center">
    <p className="eyebrow mb-6 md:mb-8 font-body">Client Record</p>
    <div className="text-6xl md:text-7xl text-gold/20 font-display leading-none mb-3 md:mb-4">"</div>
    <motion.blockquote
      key={tIndex}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="font-display italic text-xl md:text-3xl text-navy leading-relaxed md:leading-snug -mt-6 md:-mt-8 px-2 md:px-6"
    >
      {testimonials[tIndex].quote}
    </motion.blockquote>
    <div className="mt-10 flex items-center justify-between flex-wrap gap-4 md:gap-6">
      <p className="font-body text-[11px] md:text-[12px] font-semibold tracking-wide uppercase text-navy/60">
        {testimonials[tIndex].name} — {testimonials[tIndex].org}
      </p>
      <div className="flex gap-2 md:gap-3">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setTIndex(i)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-400 ease-out 
            ${i === tIndex 
              ? "w-10 md:w-12 bg-gold shadow-md scale-110" 
              : "w-2 bg-line hover:bg-gold/60 active:scale-90"}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Latest news — one large feature, two minor items. */}
{posts.length > 0 && (
  <section className="container-wide py-24 md:py-28">

    {/* Header */}
    <div className="flex items-end justify-between mb-14 flex-wrap gap-4 border-b border-line pb-8">
      <div className="pt-4">
        <p className="eyebrow mb-3">From the Journal</p>
        <h2 className="section-title font-body">Latest news</h2>
      </div>

      <Link
        to="/blog"
        className="group/btn inline-flex items-center gap-2.5
        px-5 py-2.5 rounded-full
        bg-navy text-white
        text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
        border border-navy/80 shadow-sm
        whitespace-nowrap
        transition-all duration-300 ease-out
        hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)]
        hover:-translate-y-0.5
        hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]"
      >
        Read the journal
        <span className="text-base leading-none transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
      </Link>
    </div>

    {/* Layout: 1 large + 2 half-size side posts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

      {/* Featured post — large */}
      <Link
        to={`/blog/${posts[0].slug}`}
        className="lg:col-span-2 group block rounded-2xl overflow-hidden border border-line bg-white shadow-sm
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={posts[0].featuredImage}
            alt={posts[0].title}
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="badge-gold font-body">{posts[0].category}</span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {posts[0].date && (
            <p className="font-body text-[11px] font-semibold tracking-wide uppercase text-navy/40 mb-2">
              {posts[0].date}
            </p>
          )}
          <h3 className="font-body font-semibold text-2xl md:text-3xl text-navy leading-snug inline link-underline group-hover:text-gold transition-colors">
            {posts[0].title}
          </h3>
          <p className="font-body text-navy/60 mt-3 text-sm md:text-[15px] max-w-lg leading-relaxed line-clamp-2">
            {posts[0].excerpt}
          </p>
        </div>
      </Link>

      {/* Side posts — half the size */}
      <div className="flex flex-col gap-6 md:gap-8">
        {posts.slice(1, 3).map((post) => (
          <Link
            key={post._id}
            to={`/blog/${post.slug}`}
            className="group flex-1 flex flex-col rounded-2xl overflow-hidden border border-line bg-white shadow-sm
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative overflow-hidden aspect-[16/9]">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="badge-gold  font-body !text-[10px]">{post.category}</span>
              </div>
            </div>

            <div className="p-4 md:p-5">
              {post.date && (
                <p className="font-body text-[10px] font-semibold tracking-wide uppercase text-navy/40 mb-1.5">
                  {post.date}
                </p>
              )}
              <h4 className="font-body font-semibold text-base md:text-lg text-navy leading-snug link-underline inline group-hover:text-gold transition-colors line-clamp-2">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>

    </div>
  </section>
)}

 {/* Contact CTA — split band, not a centered box. */}
<section className="bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)] grid md:grid-cols-2 relative overflow-hidden items-stretch">

  <div className="absolute inset-0 bg-hero-pattern opacity-15 pointer-events-none" />

  {/* LEFT CONTENT */}
  <div className="py-20 md:py-28 px-6 md:px-16 flex flex-col justify-center relative z-10 max-w-xl">

    <p className="eyebrow-invert mb-4 md:mb-5 tracking-wider font-body flex items-center gap-3">
      <span className="h-px w-8 " />
      Start a Project
    </p>

    <h2 className="font-body text-3xl md:text-5xl text-stone leading-tight md:leading-[1.1] tracking-tight">
      Tell us what you're building. We'll tell you what it takes.
    </h2>

    <div className="mt-10 md:mt-12">
      <Link
        to="/contact"
        className="group/btn inline-flex items-center gap-2.5 justify-center
        px-7 py-3.5 rounded-lg
        bg-gold text-navy
        font-body font-semibold text-sm tracking-wide
        shadow-[0_8px_24px_rgba(0,0,0,0.25)]
        transition-all duration-300 ease-out
        hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]
        hover:-translate-y-0.5
        hover:brightness-105"
      >
        Request a Quote
        <span className="text-base leading-none transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
          →
        </span>
      </Link>
    </div>

  </div>

  {/* RIGHT IMAGE */}
  <div className="relative min-h-[320px] md:min-h-full overflow-hidden group">

    <img
      src="https://i.pinimg.com/736x/fe/e3/c9/fee3c9ecbc261447e3fe4e44ad2a3687.jpg"
      alt="Engineers reviewing site plans"
      className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
    />

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-navy/20 via-navy/30 to-transparent md:from-navy/50" />

    {/* Seam highlight where panels meet */}
    <div className="hidden md:block absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

    {/* Subtle Edge Highlight */}
    <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />

  </div>

</section>
    </div>
  );
};

export default Home;
