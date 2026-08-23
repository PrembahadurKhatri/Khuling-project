import { useLocation, useOutlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Renders the matched route in MainLayout.jsx (in place of a bare
// <Outlet/>) so every route change plays a smooth fade + rise + scale
// transition instead of an instant swap.
//
// Deliberately uses `useOutlet()` instead of accepting a plain <Outlet/>
// as children: <Outlet/> always re-renders whatever route CURRENTLY
// matches, live — so once React Router updates on navigation, an <Outlet/>
// sitting inside the "exiting" (old) motion.div would already be showing
// the NEW page's content, not the old one, defeating the exit animation
// entirely. `useOutlet()` instead returns the matched element as a plain
// object for this render, which AnimatePresence can correctly keep frozen
// on the outgoing side while it plays out its exit animation.
//
// `mode="wait"` means the old page fully exits before the new one starts
// entering, rather than crossfading — reads as more deliberate/premium and
// avoids the two pages' content overlapping mid-transition.
const EASE = [0.76, 0, 0.24, 1];

export default function PageTransition() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 32, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 0.985 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}
