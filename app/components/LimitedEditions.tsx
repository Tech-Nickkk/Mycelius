"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
    status: "5 available",
    image: "/limited-1.png",
  },
  {
    name: "Mycelium Wall Sculpture",
    status: "2 available",
    image: "/limited-2.png",
  },
  {
    name: "Parametric Table Object",
    status: "Sold Out",
    image: "/limited-3.png",
  },
];

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

export default function LimitedEditions() {
  const spotlightRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const { isHovered: isBtnHovered, handlers: btnHandlers } = useHoverInteraction();

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Scroll Trigger animations for Title text reveal
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
        },
      });
    });
  }, []);

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
        className="relative w-full flex-grow flex items-center justify-center h-[1140px] md:h-full"
        cardsContainerClassName="cards absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
        config={{
          proximityRadius: 420,
          pushForce: 7,
          tiltAmount: 0.08,
          neighborInfluence: 0.12,
          springStiffness: 0.06,
          bounceFriction: 0.82,
        }}
        layout={{
          rotation: [-5, 5, -8],
          x: [-350, 0, 350],
          y: [-10, 8, -5],
          mobileRotation: [-2, 1, -3],
          mobileX: [0, 0, 0],
          mobileY: [-340, 0, 340],
        }}
      >
        {DEFAULT_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="card w-[230px] h-[310px] md:w-[280px] md:h-[375px] rounded-2xl overflow-hidden shadow-2xl bg-[#1c1a17] border border-white/10 cursor-grab active:cursor-grabbing group will-change-transform"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent pointer-events-none" />

              {/* Exclusivity Badge */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full backdrop-blur-md bg-black/50 border border-white/10 text-[9px] md:text-[10px] tracking-widest capitalize text-white shadow-md pointer-events-none font-semibold">
                {item.status}
              </div>

              {/* Content Overlays inside the card */}
              <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 flex flex-col pointer-events-none">
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
        <Link
          href="/"
          {...btnHandlers}
          className="group relative overflow-hidden text-xs uppercase tracking-wider px-8 py-3.5 border border-white hover:border-white text-white rounded-full transition-all duration-300 flex items-center justify-center pointer-events-auto"
        >
          <ButtonShader isHovered={isBtnHovered} colorA="#12110E" colorB="#ffffff" />
          <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-[#12110E] font-semibold flex items-center gap-2">
            View Full Collection &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
