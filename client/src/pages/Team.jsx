import { useQuery } from "@tanstack/react-query";
import { fetchTeam } from "../services/teamService.js";
import PageHeader from "../components/PageHeader.jsx";
import { FaLinkedinIn, FaFacebook, FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

// Every link here is optional — a member card only ever shows the icons for
// whichever fields the admin actually filled in (see TeamManage.jsx).
const SocialLinks = ({ social }) => {
  if (!social || !Object.values(social).some(Boolean)) return null;
  const iconClass =
    "w-9 h-9 rounded-full border border-navy/20 bg-white flex items-center justify-center text-navy/50 hover:text-white hover:bg-navy hover:border-gold shadow-sm hover:shadow-md transition-all duration-300";
  return (
    <div className="flex items-center gap-2.5 pt-4 border-t border-navy/20 mt-4">
      {social.linkedin && (
        <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={iconClass}>
          <FaLinkedinIn size={13} />
        </a>
      )}
      {social.facebook && (
        <a href={social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className={iconClass}>
          <FaFacebook size={13} />
        </a>
      )}
      {social.whatsapp && (
        <a
          href={`https://wa.me/${social.whatsapp.replace(/[^\d]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className={iconClass}
        >
          <FaWhatsapp size={13} />
        </a>
      )}
      {social.instagram && (
        <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className={iconClass}>
          <FaInstagram size={13} />
        </a>
      )}
      {social.email && (
        <a href={`mailto:${social.email}`} aria-label="Email" className={iconClass}>
          <FaEnvelope size={13} />
        </a>
      )}
    </div>
  );
};

const MemberCard = ({ member, size = "md" }) => (
  <div className="group relative rounded-2xl border border-navy/10 bg-white shadow-soft hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 overflow-hidden">
    <div className="relative overflow-hidden bg-navy aspect-[4/5]">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />

      {/* Name overlay on image for a premium editorial feel */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className={`font-body font-semibold text-white tracking-tight ${size === "lg" ? "text-2xl" : "text-lg"}`}>
          {member.name}
        </h3>
        <p className="font-body text-gold text-sm font-medium mt-1">{member.designation}</p>
      </div>
    </div>

    <div className="p-5">
      {member.department && (
        <p className="font-body text-red badge-gold text-[11px] font-semibold tracking-[0.15em] uppercase">
          {member.department}
        </p>
      )}
      {member.bio && (
        <p className="font-body text-navy/90 text-sm mt-2 leading-relaxed line-clamp-3">{member.bio}</p>
      )}
      <SocialLinks social={member.social} />
    </div>
  </div>
);

const Team = () => {
  const { data, isLoading } = useQuery({ queryKey: ["team"], queryFn: fetchTeam });
  const members = data?.data || [];
  const leadership = members.filter((m) => m.isLeadership);
  const staff = members.filter((m) => !m.isLeadership);

  return (
    <div>
      <PageHeader
        eyebrow="Who We Are"
        title="The people running the site office."
        crumb="Home / Team"
      />

      <section className="container-wide py-24 md:py-28 space-y-24">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/5] bg-line/30 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : members.length ? (
          <>
            {leadership.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <p className="font-body text-sm text-navy font-bold badge-gold tracking-wider whitespace-nowrap">Leadership</p>
                  <span className="h-px flex-1 bg-navy/10" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {leadership.map((member) => (
                    <MemberCard key={member._id} member={member} size="lg" />
                  ))}
                </div>
              </div>
            )}

            {staff.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <p className="font-body text-sm text-navy badge-gold tracking-wider whitespace-nowrap">Team</p>
                  <span className="h-px flex-1 bg-navy/10" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {staff.map((member) => (
                    <MemberCard key={member._id} member={member} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-dashed border-navy/15 bg-navy/[0.02]">
            <p className="font-body text-navy/60 text-lg">Team profiles are coming soon.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Team;