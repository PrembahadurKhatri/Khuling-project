import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1];

// Reusable line-reveal wrapper: masks a line and slides it up into view
const RevealLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.span>
  </span>
);

const Hero = () => {
  const sectionRef = useRef(null);

  // Subtle parallax + zoom on the background image as the page loads / scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] overflow-hidden font-poppins"
    >
      {/* Desktop Image */}
      <motion.img
        src="https://i.pinimg.com/1200x/1e/cd/07/1ecd071c321b7ab914471d5037c66426.jpg"
        alt="Construction site"
        style={{ y: imgY, scale: imgScale }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 1.4, ease } }}
        className="hidden sm:block absolute inset-0 w-full h-full object-cover"
      />

      {/* Mobile Image */}
      <motion.img
        src="https://img.magnific.com/premium-photo/diverse-team-engineers-construction-workers-collaborating-project-plans-industrial-site_1267867-9312.jpg?semt=ais_hybrid&w=740&q=80"
        alt="Mobile construction"
        style={{ y: imgY, scale: imgScale }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { duration: 1.4, ease } }}
        className="block sm:hidden absolute inset-0 w-full h-full object-cover"
      />

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-navy/20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/50 to-navy/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/30" />
      <div className="absolute inset-0 bg-hero-pattern opacity-40 mix-blend-overlay" />

      {/* Top hairline that draws itself in */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.7 }}
        transition={{ duration: 1.4, ease, delay: 0.3 }}
        style={{ transformOrigin: "center" }}
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/80 to-transparent"
      />

      <div className="relative h-full container-wide flex flex-col justify-center md:justify-end pt-28 md:pt-0 pb-16 md:pb-28 text-center md:text-left">
        {/* Eyebrow with a small line that draws in before the text fades in */}
        <div className="mb-4 flex items-center justify-center md:justify-start gap-3">
       
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className="eyebrow-invert text-[11px] md:text-xs tracking-[0.25em] uppercase font-medium font-body text-stone/90"
          >
            Construction & Infrastructure
          </motion.p>
        </div>

        {/* Headline: each line masks and slides up on its own beat */}
        <h1 className="font-bold font-body text-stone text-[9vw] sm:text-3xl md:text-5xl lg:text-6xl leading-[1.12] tracking-tight max-w-2xl mx-auto md:mx-0 drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
          <RevealLine delay={0.32}>We build what a</RevealLine>
          <RevealLine delay={0.44} className="text-teal-light">
            country stands on
          </RevealLine>
          <RevealLine delay={0.56} className="text-gold-light">
            with lasting impact
          </RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease, delay: 0.75 }}
          className="mt-6 text-stone/85 max-w-sm mx-auto md:mx-0 text-lg leading-relaxed font-body tracking-wide"
        >
          Roads, bridges, and commercial landmarks — built by Khilung Kalika
          Construction with the precision and durability a nation can depend
          on for decades
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.12, delayChildren: 0.95 },
            },
          }}
          className="mt-9 flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4"
        >
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.6, ease }}
            className="inline-block"
          >
            <Link
              to="/projects"
              className="group relative overflow-hidden btn-fill inline-block px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide shadow-lg shadow-black/20
                         hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300"
            >
              <span className="relative z-10">View Our Work →</span>
              {/* diagonal shine sweep on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full
                           bg-gradient-to-r from-transparent via-white/30 to-transparent
                           transition-transform duration-700 ease-out skew-x-12"
              />
            </Link>
          </motion.span>

          <motion.span
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.6, ease }}
            className="inline-block"
          >
            <Link
              to="/contact"
              className="btn-line-invert inline-block px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm
                         hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Request a Quote
            </Link>
          </motion.span>
        </motion.div>
      </div>

      <motion.a
        href="#content-start"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7, ease }}
        whileHover={{ y: 4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone/70 hover:text-stone transition-colors duration-300"
        aria-label="Scroll down"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <HiChevronDown className="text-3xl drop-shadow-md" />
        </motion.span>
      </motion.a>
    </section>
  );
};

export default Hero;