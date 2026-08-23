import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// A thin gold→teal accent bar that sweeps across the very top of the
// viewport on every route change — purely a flourish (most sites don't
// have one, which is exactly why it reads as "premium" rather than default
// React Router behavior), independent of page content (the fade/scale
// page-content transition this used to pair with was removed — it caused
// a white flash between the outgoing and incoming page). Re-fires on every
// `location.key` change (React Router bumps this on every navigation,
// including to the same path) by remounting a fresh motion.div keyed to it.
export default function RouteProgressBar() {
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timer = setTimeout(() => setActive(false), 650);
    return () => clearTimeout(timer);
  }, [location.key]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]">
      <AnimatePresence>
        {active && (
          <motion.div
            key={location.key}
            className="h-full origin-left bg-gradient-to-r from-gold via-teal to-gold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ scaleX: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }, opacity: { duration: 0.25, delay: 0.35 } }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
