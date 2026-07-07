"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ButtonShader, { useHoverInteraction } from "./ButtonShader";
import MagneticCards from "./MagneticCards";

export interface LimitedEditionItem {
  name: string;
  status: string;
  image: string;
}

const DEFAULT_ITEMS: LimitedEditionItem[] = [
  {
    name: "Mayu Lamp",
    status: "5 Left",
    image: "/limited-1.png",
  },
  {
    name: "Mycelium Wall Sculpture",
    status: "2 Left",
    image: "/limited-2.png",
  },
  {
    name: "Parametric Table Object",
    status: "Sold Out",
    image: "/limited-3.png",
  },
];

const formatStatus = (status: string) => {
  const parts = status.trim().split(/\s+/);
  if (parts.length === 2) {
    const isNum = !isNaN(Number(parts[0]));
    return (
      <div className="flex flex-col items-center justify-center font-black">
        <span className={isNum ? "text-[13px] md:text-[15px] leading-none" : "text-[9.5px] md:text-[11px] leading-tight tracking-wider"}>
          {parts[0]}
        </span>
        <span className="text-[8px] md:text-[9px] tracking-wider leading-none uppercase mt-1">
          {parts[1]}
        </span>
      </div>
    );
  }
  return <span className="text-[9.5px] md:text-[11px] font-black leading-tight tracking-wider uppercase">{status}</span>;
};

const headingTextFillStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #ffffff 50%, rgba(255, 255, 255, 0.15) 50%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

export default function LimitedEditions({ items }: { items?: LimitedEditionItem[] }) {
  const spotlightRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const { isHovered: isBtnHovered, handlers: btnHandlers } = useHoverInteraction();

  const finalItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const N = finalItems.length;

  const layout = {
    rotation: Array.from({ length: N }, (_, i) => [-5, 5, -8, 6, -4, 7][i % 6] || 0),
    x: Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * 350),
    y: Array.from({ length: N }, (_, i) => [-10, 8, -5, 10, -8, 5][i % 6] || 0),
    mobileRotation: Array.from({ length: N }, (_, i) => [-2, 1, -3, 2, -1, 3][i % 6] || 0),
    mobileX: Array.from({ length: N }, () => 0),
    mobileY: Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * 340),
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const triggers: ScrollTrigger[] = [];

    // Scroll Trigger animations for Title text reveal
    const fillLines = headingRef.current?.querySelectorAll(".fill-line") || [];
    fillLines.forEach((line) => {
      const anim = gsap.to(line, {
        backgroundPosition: "0% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: line,
          start: "top 85%",
          end: "bottom 45%",
          scrub: true,
        },
      });
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    // Scroll Trigger animations for cards reveal (smooth scrub from below with rotation)
    const cards = spotlightRef.current?.querySelectorAll(".card") || [];
    if (cards.length > 0) {
      const anim = gsap.fromTo(
        cards,
        {
          y: 280,
          rotation: (i) => [12, -8, 15][i] || 0,
        },
        {
          y: 0,
          rotation: 0,
          stagger: 0.1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: spotlightRef.current,
            start: "top 75%", // starts later, when the section is further in view
            end: "top -30%",  // ends much later, allowing the animation to continue longer
            scrub: 2.2,       // slower, smoother catch-up lag
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [finalItems]);

  return (
    <section
      ref={spotlightRef}
      className="spotlight relative w-full md:h-[110vh] min-h-fit md:min-h-[980px] bg-[#12110E] text-white overflow-hidden flex flex-col justify-between py-14 md:py-16 z-10 select-none"
    >
      {/* Title block */}
      <div 
        ref={headingRef} 
        className="w-full flex flex-col items-center justify-center z-20 pointer-events-none will-change-transform mb-6 px-6"
      >
        <h2 className="text-[15vw] xs:text-[14vw] sm:text-[13vw] md:text-[8vw] font-normal tracking-tight leading-[1.05] w-fit text-center">
          <span 
            className="fill-line block text-center will-change-[background-position,transform]"
            style={headingTextFillStyle}
          >
            Limited Editions
          </span>
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base lg:text-lg leading-relaxed mt-5 text-center">
          A small collection of objects grown in our lab. Produced in extremely limited quantities and released when available.
        </p>
      </div>

      {/* Reusable Magnetic Cards container */}
      <MagneticCards
        parentRef={spotlightRef}
        className="relative w-full grow flex items-center justify-center h-[1140px] md:h-full"
        cardsContainerClassName="cards absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
        config={{
          proximityRadius: 420,
          pushForce: 7,
          tiltAmount: 0.08,
          neighborInfluence: 0.12,
          springStiffness: 0.06,
          bounceFriction: 0.82,
        }}
        layout={layout}
      >
        {finalItems.map((item, idx) => (
          <div
            key={idx}
            className="card w-[230px] h-[310px] md:w-[280px] md:h-[375px] rounded-2xl overflow-hidden bg-[#1c1a17] border border-white/10 cursor-grab active:cursor-grabbing group will-change-transform"
          >
            {/* Card Image */}
            <div className="relative w-full h-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover pointer-events-none"
                sizes="(max-width: 768px) 230px, 280px"
                priority
              />

              {/* Gradient Shadow Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/25 to-transparent pointer-events-none" />

              {/* Exclusivity Badge */}
              <div className="absolute top-4 right-4 z-10 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] rotate-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full fill-[#F15B20]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Central splat blob */}
                  <path d="M50,15 C40,5 30,12 25,22 C20,32 5,30 8,42 C11,54 2,62 10,72 C18,82 22,72 32,82 C42,92 52,98 62,90 C72,82 82,92 88,82 C94,72 90,62 95,52 C100,42 92,34 88,24 C84,14 74,22 64,12 C54,2 60,25 50,15 Z" />
                  {/* Surrounding droplets */}
                  <circle cx="20" cy="18" r="3" />
                  <circle cx="85" cy="80" r="2.5" />
                  <circle cx="15" cy="78" r="2" />
                  <circle cx="82" cy="20" r="3.5" />
                </svg>
                <div className="relative text-black text-center select-none font-bold">
                  {formatStatus(item.status)}
                </div>
              </div>

              {/* Content Overlays inside the card */}
              <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 text-center pointer-events-none z-10">
                <h3 className="text-white text-base md:text-lg font-semibold leading-tight capitalize tracking-wide">
                  {item.name}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </MagneticCards>

      {/* Button block */}
      <div className="w-full flex justify-center px-6 relative z-20">
        <a
          href="https://wa.me/919354097886"
          target="_blank"
          rel="noopener noreferrer"
          {...btnHandlers}
          className="group relative overflow-hidden text-xs uppercase tracking-wider px-8 py-3.5 border border-white hover:border-white text-white rounded-full transition-all duration-300 flex items-center justify-center pointer-events-auto"
        >
          <ButtonShader isHovered={isBtnHovered} colorA="#12110E" colorB="#ffffff" />
          <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-[#12110E] font-semibold flex items-center gap-2">
            Get Yours Now &rarr;
          </span>
        </a>
      </div>
    </section>
  );
}
