import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const Counter = ({ value, label, suffix = "+", size = "md" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center sm:text-left"
    >
      <div className={`font-body text-gold-light leading-none ${size === "lg" ? "text-5xl sm:text-6xl md:text-7xl" : "text-3xl sm:text-4xl md:text-5xl"}`}>
        {count}{suffix}
      </div>
      <p className="mt-3 font-body text-[11px] font-semibold tracking-widest2 uppercase text-stone/60">{label}</p>
    </motion.div>
  );
};

export default Counter;
