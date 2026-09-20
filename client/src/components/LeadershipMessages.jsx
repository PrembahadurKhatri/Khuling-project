import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";

const EASE = [0.16, 1, 0.3, 1];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

const Avatar = ({ msg, size }) => (
  msg.photo ? (
    <div className="relative rounded-full p-[3px] bg-gradient-to-br from-gold via-gold/60 to-navy/40 shadow-lg">
      <div className="rounded-full bg-white p-[3px]">
        <img
          src={msg.photo}
          alt={msg.name}
          className={`${size} rounded-full object-cover transition-transform duration-700 ease-out group-hover:scale-105`}
        />
      </div>
    </div>
  ) : (
    <div className={`${size} rounded-full bg-navy/10 flex items-center justify-center text-navy/30 font-body font-bold`}>
      {msg.name?.charAt(0) || "M"}
    </div>
  )
);

/**
 * Featured leadership messages on the homepage — one card per post (MD,
 * CEO, Treasurer, ...), admin-managed as a list (services/messageService.js,
 * pages/admin/MessagesManage.jsx). Sits between "proof of work" (Projects)
 * and "how we work" (Services). Renders nothing if there are no messages
 * yet, so an empty admin list doesn't leave a bare section on the live site.
 *
 * The first entry (lowest "order", typically the MD/CEO) gets a wide,
 * featured horizontal treatment; the rest share a quieter grid of compact
 * cards below — the same visual hierarchy used elsewhere on the site for a
 * "most important + supporting" group, instead of every message stacking as
 * an identical full-width bar.
 */
const LeadershipMessages = ({ messages }) => {
  if (!messages || messages.length === 0) return null;
  const [featured, ...rest] = messages;

  return (
    <motion.section
      className="relative overflow-hidden border-t border-line"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      {/* subtle background texture, matching the rest of the page */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20 pointer-events-none" />

      {/* decorative glow orbs */}
      <div className="absolute -left-24 top-0 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-24 bottom-0 w-80 h-80 rounded-full bg-navy/5 blur-3xl pointer-events-none" />

      <div className="container-wide py-20 md:py-28 relative">
        {/* Header — left-aligned, matching the rest of the page's sections */}
        <div className="font-body max-w-xl mb-14 md:mb-16">
          <p className="eyebrow mb-3 tracking-[0.18em]">Leadership</p>
          <h2 className="section-title font-body leading-[1.15]">Messages from our leadership</h2>
        </div>

        {/* Featured message */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="group relative rounded-3xl border border-line bg-white/80 backdrop-blur-sm
            shadow-[0_20px_60px_rgba(10,25,47,0.08)] hover:shadow-[0_30px_80px_rgba(10,25,47,0.14)]
            transition-shadow duration-500 overflow-hidden"
        >
          <div className="grid md:grid-cols-[260px_1fr]">
            <div className="relative p-8 md:p-10 flex items-center justify-center bg-navy/[0.03]">
              <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <Avatar msg={featured} size="h-36 w-36 md:h-40 md:w-40 text-4xl" />
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-center relative">
              <FaQuoteLeft className="text-gold/25 text-4xl md:text-5xl mb-4" aria-hidden="true" />
              <p className="text-navy/80 leading-relaxed text-[15px] md:text-lg font-body whitespace-pre-line">
                {featured.message}
              </p>
              <div className="mt-6 pt-6 border-t border-line">
                <p className="font-body font-semibold text-navy text-lg">{featured.name}</p>
                {featured.designation && (
                  <p className="font-body text-sm text-gold tracking-wide uppercase mt-0.5">{featured.designation}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Supporting leadership — quieter, uniform card grid */}
        {rest.length > 0 && (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {rest.map((msg) => (
              <motion.div
                key={msg._id}
                variants={staggerItem}
                className="group relative flex flex-col items-center text-center gap-4 p-8 rounded-2xl border border-line
                  bg-white/70 backdrop-blur-sm shadow-sm transition-all duration-300
                  hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-[0_20px_45px_rgba(10,25,47,0.1)]"
              >
                <FaQuoteLeft className="absolute top-6 right-6 text-gold/15 text-3xl" aria-hidden="true" />
                <Avatar msg={msg} size="h-20 w-20 text-xl" />
                <p className="text-navy/70 leading-relaxed text-sm font-body relative z-10">{msg.message}</p>
                <div className="mt-auto pt-2">
                  <p className="font-body font-semibold text-navy">{msg.name}</p>
                  {msg.designation && (
                    <p className="font-body text-xs text-gold tracking-wide uppercase mt-0.5">{msg.designation}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default LeadershipMessages;
