import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";

const demoImages = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  src: `https://placehold.co/600x400?text=Gallery+${i + 1}`,
}));

// Deliberate mosaic rhythm instead of a uniform grid — a couple of tiles run
// large, the rest fall into a regular rhythm around them, like a contact sheet.
const spanForIndex = (i) => {
  if (i === 0) return "sm:col-span-2 sm:row-span-2";
  if (i === 5) return "sm:row-span-2";
  if (i === 8) return "sm:col-span-2";
  return "";
};

const Gallery = () => {
  const [active, setActive] = useState(null);

  return (
    <div>
      <PageHeader
        eyebrow="Site Record"
        title="Progress, documented as it happens."
        crumb="Home / Gallery"
      />

      <section className="container-wide py-24 md:py-28">
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[190px] gap-3">
          {demoImages.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(img)}
              className={`overflow-hidden group ${spanForIndex(i)}`}
            >
              <img
                src={img.src}
                alt={`Gallery ${img.id}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <img src={active.src} alt="Enlarged" className="max-h-[90vh] max-w-full" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
