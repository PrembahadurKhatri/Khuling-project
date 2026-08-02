// A left-aligned, asymmetric interior header — used instead of the generic
// centered "hero band" pattern that would otherwise repeat on every page.
const PageHeader = ({ eyebrow, title, crumb, children }) => (
  <section className="bg-navy pt-36 pb-16 md:pt-44 md:pb-20">
    <div className="container-wide">
      <p className="eyebrow-invert mb-4">{eyebrow}</p>
      <h1 className="font-display font-extrabold text-2xl md:text-4xl max-w-2xl leading-[1.1] tracking-[-0.02em]">
        <span className="block text-stone">{title}</span>
      </h1>
      {children && <div className="mt-6 max-w-lg text-stone/70 text-[15px] leading-relaxed">{children}</div>}
      {crumb && <p className="mt-8 font-mono text-[11px] tracking-wide uppercase text-stone/40">{crumb}</p>}
    </div>
  </section>
);

export default PageHeader;
