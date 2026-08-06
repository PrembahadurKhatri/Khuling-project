const PageHeader = ({ eyebrow, title, crumb, children }) => (
  <section className="relative bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)] pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
    <div className="absolute inset-0 bg-hero-pattern opacity-40" />
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />
    <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal/5 blur-3xl" />
    <div className="absolute -left-20 bottom-0 w-60 h-60 rounded-full bg-gold/5 blur-3xl" />

    <div className="container-wide relative">
      <div className="w-12 h-1  mb-5" />
      <p className="eyebrow-invert mb-4">{eyebrow}</p>
      <h1 className="font-body font-bold text-2xl md:text-4xl lg:text-5xl max-w-3xl leading-[1.1] tracking-[-0.02em] text-stone">
        {title}
      </h1>
      {children && (
        <div className="mt-6 max-w-lg text-stone/75 text-[15px] leading-relaxed font-body">{children}</div>
      )}
      {crumb && (
        <p className="mt-8 font-body text-[11px] tracking-wide uppercase text-stone/40">{crumb}</p>
      )}
    </div>
  </section>
);

export default PageHeader;
