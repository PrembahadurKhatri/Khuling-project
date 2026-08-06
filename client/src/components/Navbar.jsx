import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },   
  { to: "/projects", label: "Projects" },   
  { to: "/team", label: "Team" },           
  { to: "/blog", label: "Journal" },
  { to: "/gallery", label: "Gallery" },
  { to: "/careers", label: "Careers" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const solid = scrolled || open;
  const tone = solid ? "text-navy" : "text-stone";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-paper shadow-lg border-b border-line/50"
          : "bg-gradient-to-b from-navy/50 via-navy/20 to-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-20">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
          <div className={`p-1.5 rounded-md transition-all duration-300 group-hover:scale-105 ${
            solid ? "bg-navy/5" : "bg-stone/10"
          }`}>
            <img src="/logo.png" alt="Khilung Kalika Construction" className="h-8 w-8" />
          </div>

          <span className="font-body font-bold text-[17px] leading-none tracking-[-0.02em]">
            <span className={`${tone} transition-colors`}>Khilung </span>
            <span className={`${tone} transition-colors`}>
              Kalika
            </span>
            <span className="block font-body font-semibold text-[8px] tracking-[0.22em] uppercase mt-1 text-gold">
              Construction Pvt. Ltd.
            </span>
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `relative font-body font-semibold text-[13px] tracking-wide transition-all duration-300 ${tone} ${
                  isActive
                    ? "after:w-full opacity-100"
                    : "after:w-0 opacity-80 hover:opacity-100"
                } after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gold after:transition-all after:duration-300`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            className={`ml-4 ${
              scrolled
                ? "btn-fill !py-2.5 !px-5 !text-xs shadow-md"
                : "btn-line-invert !py-2.5 !px-5 !text-xs backdrop-blur-sm"
            }`}
          >
            Request a Quote
          </NavLink>
        </nav>

        {/* Mobile Button */}
        <button
          className={`lg:hidden text-2xl p-2 rounded-md transition-all ${tone} ${
            solid ? "hover:bg-navy/5" : "hover:bg-stone/10"
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-20 bg-paper z-40"
          >
            <div className="px-6 py-10 flex flex-col gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `font-body font-semibold text-base tracking-wide py-4 px-4 rounded-md transition-all ${
                      isActive
                        ? "text-teal bg-teal/10"
                        : "text-navy hover:bg-stone/80"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
                className="btn-fill justify-center mt-6 shadow-lg "
              >
                Request a Quote
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;