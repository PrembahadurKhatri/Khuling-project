import { motion } from "framer-motion";

// Each variant's { initial, animate } pair — animate is always the resting
// state (opacity 1, no offset). "up" is the default; the others give
// sections some variety instead of every single block using an identical
// fade-up, which is what makes a page of these read as deliberate rather
// than a single reused snippet copy-pasted everywhere.
const VARIANTS = {
  up: (y) => ({ initial: { opacity: 0, y, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 } }),
  left: (y) => ({ initial: { opacity: 0, x: -40, y: y / 2 }, animate: { opacity: 1, x: 0, y: 0 } }),
  right: (y) => ({ initial: { opacity: 0, x: 40, y: y / 2 }, animate: { opacity: 1, x: 0, y: 0 } }),
  scale: () => ({ initial: { opacity: 0, scale: 0.85 }, animate: { opacity: 1, scale: 1 } }),
};

/**
 * Fades (+ slides/scales, depending on `variant`) content into place the
 * first time it scrolls into view. Thin wrapper around framer-motion so
 * pages don't hand-roll the same whileInView block everywhere.
 */
export default function Reveal({ children, delay = 0, y = 28, className = "", variant = "up" }) {
  const { initial, animate } = (VARIANTS[variant] || VARIANTS.up)(y);
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
