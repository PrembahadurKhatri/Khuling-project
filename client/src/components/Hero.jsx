import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1];

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-navy">
      <img
        src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2400&auto=format&fit=crop"
        alt="Structural steel and concrete framework at a Khilung Kalika construction site"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />

      <div className="relative h-full container-wide flex flex-col justify-end pb-20 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="eyebrow-invert mb-5"
        >
          Construction &amp; Infrastructure
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="font-display font-extrabold text-stone text-[9vw] sm:text-4xl md:text-5xl leading-[1] max-w-3xl tracking-[-0.02em]"
        >
          <span className="block text-stone">We build what a</span>
          <span className="block text-navy-light [text-shadow:0_0_14px_rgba(245,243,238,0.7),0_0_3px_rgba(245,243,238,0.9)]">country stands on</span>
          <span className="block text-gold-light">with lasting impact</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.35 }}
          className="mt-7 text-stone/75 max-w-md text-[15px] leading-relaxed"
        >
          Roads, bridges, and commercial developments engineered by Khilung Kalika
          Construction — delivered on schedule, built to last decades.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <Link to="/projects" className="btn-fill">View Our Work</Link>
          <Link to="/contact" className="btn-line-invert">Request a Quote</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
