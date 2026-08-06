import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader.jsx";
import { fetchGallery } from "../services/galleryService.js";
import { HiX, HiOutlinePhotograph } from "react-icons/hi";

const Gallery = () => {
  const [active, setActive] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchGallery(),
  });

  const images = data?.data || [];

  return (
    <div>
      <PageHeader
        eyebrow="Site Record"
        title="Captured moments from our ongoing work."
        crumb="Home / Gallery"
      />

      <section className="container-wide py-24 md:py-32 relative">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,42,76,0.06),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(11,31,58,0.06),transparent_40%)]" />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-stone animate-pulse" />
            ))}
          </div>
        ) : images.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <button
                key={img._id}
                onClick={() => setActive(img)}
                className="relative overflow-hidden rounded-2xl group aspect-[4/3] border border-navy/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Image */}
                <img
                  src={img.image}
                  alt={img.caption || `Gallery ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                {/* Caption */}
                <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition duration-500 translate-y-1 group-hover:translate-y-0">
                  <p className="font-body text-sm font-medium line-clamp-2">
                    {img.caption || "View image"}
                  </p>
                </div>

                {/* Icon */}
                <div className="absolute top-3 right-3 text-white opacity-0 group-hover:opacity-100 transition duration-500">
                  <HiOutlinePhotograph size={18} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-dashed border-navy/15 bg-navy/[0.02]">
            <h2 className="font-display text-2xl text-navy mb-2">No images yet</h2>
            <p className="font-body text-navy/60">
              We'll be adding project visuals soon. Stay tuned.
            </p>
          </div>
        )}
      </section>

      {/* PREMIUM MODAL */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-3xl transition"
            onClick={() => setActive(null)}
          >
            <HiX />
          </button>

          {/* Image */}
          <div className="max-w-5xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.image}
              alt={active.caption || "Preview"}
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Caption */}
            {active.caption && (
              <div className="mt-4 text-center font-body text-white/80 text-sm">
                {active.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;