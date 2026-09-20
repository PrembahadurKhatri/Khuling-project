import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDesignBySlug } from "../services/designService.js";
import Seo from "../components/Seo.jsx";
import { HiArrowLeft, HiArrowRight, HiX, HiOutlineDocumentText, HiOutlinePlay } from "react-icons/hi";

// Turns a pasted YouTube/Vimeo watch/share URL into an embeddable iframe
// src. Falls back to the original URL for anything already embed-shaped
// (or a host we don't recognize) rather than breaking the embed outright.
const toEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return url;
  }
};

const DesignDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["design", slug],
    queryFn: () => fetchDesignBySlug(slug),
  });
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="section space-y-4">
        <div className="h-[50vh] min-h-[360px] bg-stone rounded-2xl animate-pulse" />
        <div className="h-8 w-1/2 bg-stone rounded animate-pulse" />
        <div className="h-4 w-full bg-stone rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-stone rounded animate-pulse" />
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="section text-center">
        <Seo title="Design Not Found" noindex />
        <p className="font-body text-navy/60 text-lg">Design not found.</p>
        <Link to="/services/design" className="font-body inline-flex items-center gap-2 text-teal font-medium mt-4 hover:underline">
          <HiArrowLeft /> Back to designs
        </Link>
      </div>
    );
  }

  const design = data.data;
  const related = data.related || [];
  const images = design.images ?? [];
  const videos = design.videos ?? [];

  const showPrev = () => setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const showNext = () => setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div>
      <Seo title={design.name} description={design.description?.slice(0, 160)} image={images[0]} />

      {/* ---------- Hero ---------- */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        {images[0] ? (
          <img src={images[0]} alt={design.name} className="w-full h-full object-cover scale-105" />
        ) : (
          <div className="w-full h-full bg-navy/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-navy/10" />
        <div className="absolute inset-0 bg-hero-pattern opacity-20" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="container-wide pb-10 pt-20">
            <Link
              to="/services/design"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone/80 hover:text-gold transition-colors duration-300 font-body mb-4"
            >
              <HiArrowLeft /> Back to designs
            </Link>
            {design.category && <span className="badge-gold font-body mb-5 inline-block">{design.category}</span>}
            <h1 className="font-body text-3xl md:text-5xl text-stone leading-[1.1] max-w-3xl">{design.name}</h1>
          </div>
        </div>
      </div>

      {/* ---------- Body ---------- */}
      <section className="section grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {design.description && (
            <div>
              <h2 className="font-body text-2xl md:text-3xl text-navy mb-4">Overview</h2>
              <p className="font-body text-navy/70 leading-relaxed text-lg whitespace-pre-line">{design.description}</p>
            </div>
          )}

          {/* ---------- Gallery ---------- */}
          {images.length > 0 && (
            <div>
              <h2 className="font-body text-2xl md:text-3xl text-navy mb-4">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-line"
                  >
                    <img
                      src={src}
                      alt={`${design.name} — photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------- Videos ---------- */}
          {videos.length > 0 && (
            <div>
              <h2 className="font-body text-2xl md:text-3xl text-navy mb-4 flex items-center gap-2">
                <HiOutlinePlay className="text-teal" /> Videos
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {videos.map((url, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden border border-line bg-navy/5">
                    <iframe
                      src={toEmbedUrl(url)}
                      title={`${design.name} video ${i + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Details card ---------- */}
        <aside className="card p-8 h-fit space-y-6 lg:sticky lg:top-28">
          <h3 className="font-body text-xl text-navy border-b border-line pb-4">Design Details</h3>
          {design.category && (
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-wider text-navy mb-0.5">Category</p>
              <p className="font-body text-sm text-navy/90 font-medium">{design.category}</p>
            </div>
          )}
          {design.dpr && (
            <a
              href={design.dpr}
              target="_blank"
              rel="noreferrer"
              className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
                bg-navy text-white text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
                border border-navy/80 shadow-sm whitespace-nowrap
                transition-all duration-300 ease-out hover:shadow-[0_6px_20px_rgba(10,25,47,0.35)] hover:-translate-y-0.5
                hover:bg-[linear-gradient(135deg,#0b1f3a_0%,#102a4c_50%,#0a192f_100%)]"
            >
              <HiOutlineDocumentText className="text-sm" /> Download DPR
            </a>
          )}
          <Link
            to="/contact"
            className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
              border border-navy/30 text-navy text-[11px] md:text-[12px] font-body font-semibold tracking-wide uppercase
              transition-all duration-300 ease-out hover:border-navy hover:bg-navy hover:text-white"
          >
            Discuss a similar design
          </Link>
        </aside>
      </section>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="section bg-paper border-t border-line relative">
          <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="pt-4 mb-10">
              <h2 className="font-body text-2xl md:text-3xl text-navy">Related Designs</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((d) => (
                <Link
                  key={d._id}
                  to={`/services/design/${d.slug || d._id}`}
                  className="group rounded-2xl border border-line bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(10,25,47,0.10)]"
                >
                  {d.images?.[0] ? (
                    <div className="h-40 overflow-hidden">
                      <img src={d.images[0]} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-40 bg-navy/5" />
                  )}
                  <div className="p-5">
                    <h3 className="font-body text-lg text-navy font-semibold">{d.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Lightbox ---------- */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-navy/95 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <button
            className="absolute top-6 right-6 text-stone/80 hover:text-gold transition-colors"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
          >
            <HiX className="text-3xl" />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-10 text-stone/70 hover:text-gold transition-colors"
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                aria-label="Previous photo"
              >
                <HiArrowLeft className="text-3xl" />
              </button>
              <button
                className="absolute right-4 md:right-10 text-stone/70 hover:text-gold transition-colors"
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                aria-label="Next photo"
              >
                <HiArrowRight className="text-3xl" />
              </button>
            </>
          )}

          <img
            src={images[lightboxIndex]}
            alt={`${design.name} — photo ${lightboxIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <span className="font-body absolute bottom-6 text-stone/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default DesignDetail;
