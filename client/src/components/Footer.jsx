import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../services/settingsService.js";

const socialIconClass =
  "w-10 h-10 rounded-sm border border-stone/20 flex items-center justify-center text-stone/70 hover:bg-gold hover:border-gold hover:text-navy transition-all duration-300 hover:-translate-y-1";

const Footer = () => {
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data || {};
  const social = settings.social || {};

  return (
    <footer className="bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)] font-body  text-stone/80 relative overflow-hidden">

      {/* Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal via-gold to-teal opacity-80" />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />

      {/* MAIN GRID */}
      <div className="container-wide py-20 md:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 md:gap-12 relative">

        {/* BRAND */}
        <div className="lg:col-span-5 max-w-md font-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-stone/10 rounded-sm">
              <img
                src="/logo.png"
                alt={settings.companyName || "Khilung Kalika Construction"}
                className="h-10 w-10"
              />
            </div>
            <span className="font-body text-xl text-stone leading-tight">
              {settings.companyName || "Khilung Kalika Construction Pvt. Ltd."}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-stone/70">
            {settings.tagline ||
              "An engineering and construction firm delivering roads, bridges, and commercial developments across Nepal — built to a standard that outlasts the contract."}
          </p>

          <div className="flex gap-3 mt-8">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                <FaFacebookF />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                <FaLinkedinIn />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                <FaYoutube />
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={socialIconClass}>
                <FaInstagram />
              </a>
            )}
          </div>
        </div>

        {/* COMPANY */}
        <div className="lg:col-span-2">
          <p className="eyebrow-invert mb-6 font-body">Company</p>
          <ul className="space-y-3 text-sm text-stone/70">
            <li><Link to="/about" className="hover:text-gold transition-colors font-body">About</Link></li>
            <li><Link to="/projects" className="hover:text-gold transition-colors font-body">Projects</Link></li>
            <li><Link to="/careers" className="hover:text-gold transition-colors font-body">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors font-body">Blogs</Link></li>
          </ul>
        </div>

        {/* SERVICES */} 
        <div className="lg:col-span-2">
          <p className="eyebrow-invert mb-6 font-body">Services</p>
          <ul className="space-y-3 text-sm text-stone/70">
            <li> <Link to="/services" className="hover:text-gold transition-colors font-body">Infrastructure</Link></li>
            <li ><Link to="/services" className="hover:text-gold transition-colors font-body">Road &amp; Bridge</Link></li>
            <li ><Link to="/services" className="hover:text-gold transition-colors font-body">Commercial Building</Link></li>
            <li className="hover:text-gold transition-colors font-body">Project Management</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="lg:col-span-3">
          <p className="eyebrow-invert mb-6 font-body">Contact</p>
          <ul className="space-y-4 text-sm text-stone/70">
            <li className="flex items-start gap-3">
              <span className="text-gold mt-1">●</span>
              <span>{settings.address || "Kathmandu, Nepal"}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold mt-1">●</span>
              <span>{settings.phone || "+977-1-XXXXXXX"}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-gold mt-1">●</span>
              <span>{settings.email || "info@khilungkalika.com"}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-stone/10 font-body">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] tracking-wide text-stone/50">
          <span>
            © {new Date().getFullYear()} {settings.companyName || "Khilung Kalika Construction Pvt. Ltd."}
          </span>
          <span className="text-stone/40 font-body">
            Built with precision and trust
          </span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;