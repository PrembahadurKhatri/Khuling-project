import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "../services/settingsService.js";

const Footer = () => {
  const { data } = useQuery({ queryKey: ["public-settings"], queryFn: fetchSettings });
  const settings = data?.data || {};
  const social = settings.social || {};

  return (
    <footer className="bg-navy text-stone/80">
      <div className="container-wide py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Identity — wider column, not equal-width like the rest */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt={settings.companyName || "Khilung Kalika Construction"} className="h-11 w-11" />
            <span className="font-display text-xl text-stone leading-tight">
              {settings.companyName || "Khilung Kalika Construction Pvt. Ltd."}
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm">
            {settings.tagline ||
              "An engineering and construction firm delivering roads, bridges, and commercial developments across Nepal — built to a standard that outlasts the contract."}
          </p>
          <div className="flex gap-5 mt-6 text-base">
            {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold-light"><FaFacebookF /></a>}
            {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-gold-light"><FaLinkedinIn /></a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-gold-light"><FaYoutube /></a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold-light"><FaInstagram /></a>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow-invert mb-4">Company</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-gold-light">About</Link></li>
            <li><Link to="/projects" className="hover:text-gold-light">Projects</Link></li>
            <li><Link to="/careers" className="hover:text-gold-light">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-gold-light">Journal</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow-invert mb-4">Services</p>
          <ul className="space-y-2.5 text-sm">
            <li>Infrastructure</li>
            <li>Road &amp; Bridge</li>
            <li>Commercial Building</li>
            <li>Project Management</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="eyebrow-invert mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm font-mono">
            <li>{settings.address || "Kathmandu, Nepal"}</li>
            <li>{settings.phone || "+977-1-XXXXXXX"}</li>
            <li>{settings.email || "info@khilungkalika.com"}</li>
          </ul>
        </div>
      </div>

      <div className="rule-invert">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-[11px] tracking-wide text-stone/50">
          <span>© {new Date().getFullYear()} {settings.companyName || "Khilung Kalika Construction Pvt. Ltd."}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
