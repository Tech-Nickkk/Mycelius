"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonShader, { useHoverInteraction } from "./ButtonShader";

export interface GalleryItem {
  id?: string;
  title?: string;
  description?: string;
  image: string;
}

function ModalShaderIconButton({
  onClick,
  ariaLabel,
  className = "",
  children,
}: {
  onClick: (e: React.MouseEvent) => void;
  ariaLabel: string;
  className?: string;
  children: (isHovered: boolean) => React.ReactNode;
}) {
  const { isHovered, handlers } = useHoverInteraction();
  const positionClass = className.includes("absolute") || className.includes("fixed") ? "" : "relative";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      {...handlers}
      className={`w-11 h-11 rounded-full border border-white/20 ${positionClass} overflow-hidden flex items-center justify-center cursor-pointer transition-colors duration-300 group hover:border-white shrink-0 ${className}`}
    >
      <ButtonShader isHovered={isHovered} colorA="#12110E" colorB="#ffffff" />
      {children(isHovered)}
    </button>
  );
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Acoustic Mycelium Wall Panels",
    description: "Modular bio-composite wall panels grown using natural agricultural byproduct and active mycelium, offering exceptional acoustic damping and tactile organic geometry.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g2",
    title: "Cultivated Biomaterial Luminaire",
    description: "Ambient table lighting with a shade sculpted entirely from living fungal tissue, casting a warm diffuse glow through natural fibrous grain.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g3",
    title: "Sculptural Myco-Vase Series",
    description: "Limited production decorative vessels combining custom 3D substrate lattice framing with dense structural mycelium growth.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g4",
    title: "Bio-Pavilion Installation",
    description: "Architectural scale spatial exhibit exploring sustainable material circularity and regenerative living structures for indoor public spaces.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g5",
    title: "Organic Lounge Stool",
    description: "Lightweight, highly durable seating piece formed in a custom molded growth chamber without synthetic binders or adhesives.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "g6",
    title: "Parametric Facade Tile Prototype",
    description: "Interlocking modular facade element engineered for thermal regulation, carbon sequestration, and natural visual relief.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
  },
];

const headingTextFillStyle: React.CSSProperties = {
  backgroundImage: "linear-gradient(to top, #ffffff 49.8%, rgba(255, 255, 255, 0.15) 50.2%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

const headingTextFillStyleOrange: React.CSSProperties = {
  backgroundImage: "linear-gradient(to top, #FF5500 49.8%, rgba(255, 85, 0, 0.25) 50.2%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

export default function Gallery({ items }: { items?: GalleryItem[] }) {
  const finalItems = items && items.length > 0 ? items : DEFAULT_GALLERY;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  // Handle keyboard ESC and Arrow Navigation in Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % finalItems.length : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + finalItems.length) % finalItems.length : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIndex, finalItems.length]);

  // ScrollTrigger reveal animations for header text
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Title text fill animation
      const fillLines = headingRef.current?.querySelectorAll(".fill-line") || [];
      fillLines.forEach((line) => {
        gsap.to(line, {
          backgroundPosition: "0% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "bottom 45%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [finalItems] }
  );

  const selectedItem = selectedIndex !== null ? finalItems[selectedIndex] : null;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative w-full bg-[#12110E] text-white py-20 md:py-28 px-4 sm:px-8 md:px-14 select-none overflow-hidden z-10"
    >
      {/* Heading Block */}
      <div
        ref={headingRef}
        className="w-full flex flex-col items-center justify-center z-20 pointer-events-none mb-16 sm:mb-20 md:mb-24 px-4"
      >
        <h2 className="text-[8.5vw] xs:text-[7.5vw] sm:text-[6.5vw] md:text-[4.4vw] font-extralight font-kodchasan tracking-tight leading-[1.25] text-center">
          <span className="fill-line inline-block pb-[0.05em] will-change-[background-position,transform]" style={headingTextFillStyle}>
            What&nbsp;We&apos;ve&nbsp;
          </span>
          <span className="fill-line inline-block pb-[0.05em] will-change-[background-position,transform]" style={headingTextFillStyleOrange}>
            Grown
          </span>
        </h2>
        <p className="text-[#D4D0C9] text-xs sm:text-sm max-w-2xl mx-auto font-light font-avenir-next tracking-[0.05em] leading-relaxed text-center mt-1 sm:mt-1.5">
          India&apos;s first fungi-grown interior biomaterial. And this is what it looks like:
        </p>
      </div>

      {/* Image Grid - Pure sharp square grid without text */}
      <div
        className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6 relative z-20"
      >
        {finalItems.map((item, index) => (
          <div
            key={item.id || index}
            onClick={() => setSelectedIndex(index)}
            className="gallery-card group relative aspect-square rounded-none overflow-hidden bg-[#1c1a17] border border-white/10 cursor-pointer"
          >
            {/* Image */}
            <Image
              src={item.image}
              alt=""
              fill
              unoptimized
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
            />

            {/* Subtle Hover overlay */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Lightbox Image-Only Modal */}
      {selectedItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 cursor-zoom-out"
          onClick={() => setSelectedIndex(null)}
        >

          {/* Previous Button */}
          {finalItems.length > 1 && (
            <ModalShaderIconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((selectedIndex - 1 + finalItems.length) % finalItems.length);
              }}
              ariaLabel="Previous image"
              className="absolute left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex"
            >
              {(isHovered) => (
                <svg
                  className={`w-4 h-4 z-10 transition-colors duration-500 ${
                    isHovered ? "text-black" : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              )}
            </ModalShaderIconButton>
          )}

          {/* Next Button */}
          {finalItems.length > 1 && (
            <ModalShaderIconButton
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((selectedIndex + 1) % finalItems.length);
              }}
              ariaLabel="Next image"
              className="absolute right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden sm:flex"
            >
              {(isHovered) => (
                <svg
                  className={`w-4 h-4 z-10 transition-colors duration-500 ${
                    isHovered ? "text-black" : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </ModalShaderIconButton>
          )}

          {/* Modal Image Display Box */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center z-10 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedItem.image}
              alt={selectedItem.title || "Gallery image"}
              className="max-h-[85vh] max-w-[90vw] sm:max-w-4xl w-auto h-auto object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
