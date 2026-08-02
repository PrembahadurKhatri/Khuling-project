import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
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

  const tone = scrolled ? "text-navy" : "text-stone";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-stone/95 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <div className="container-wide flex items-center justify-between h-20">
        <NavLink to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo.png" alt="Khilung Kalika Construction" className="h-8 w-8" />
          <span className="font-display font-bold text-[17px] leading-none tracking-[-0.02em]">
            <span className={tone}>Khilung </span>
            <span className={scrolled ? "text-navy" : "text-navy-light"}>Kalika</span>
            <span className="block font-display font-medium text-[8px] tracking-[0.22em] uppercase mt-1 text-gold">
              Construction Pvt. Ltd.
            </span>
          </span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `link-underline font-display font-bold text-[13px] tracking-wide pb-1 ${tone} ${
                  isActive ? "opacity-100 after:w-full" : "opacity-75 hover:opacity-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={scrolled ? "btn-fill !py-2.5 !px-5" : "btn-line-invert !py-2.5 !px-5"}
          >
            Request a Quote
          </NavLink>
        </nav>

        <button
          className={`lg:hidden text-2xl ${tone}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-stone border-t border-line px-6 py-6 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="font-display font-bold text-sm tracking-wide text-navy py-2 border-b border-line"
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" onClick={() => setOpen(false)} className="btn-fill justify-center mt-2">
            Request a Quote
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
