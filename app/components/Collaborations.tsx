"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const textFillStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #ffffff 50%, rgba(255, 255, 255, 0.15) 50%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

export default function Collaborations() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !headingRef.current) return;

      const fillLines = headingRef.current.querySelectorAll(".fill-line");

      // Scroll-triggered text fill animation
      gsap.to(fillLines, {
        backgroundPosition: "0% 100%",
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          end: "bottom 45%",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="collaborations-section"
      className="relative w-full min-h-[50vh] md:h-screen bg-[#12110E] flex items-center justify-center py-12 md:py-0 px-6 md:px-16 lg:px-24 overflow-hidden select-none z-30"
    >
      {/* Core Typography Statement */}
      <div ref={headingRef} className="max-w-5xl w-full">
        <h2 className="text-[7vw] xs:text-[6.5vw] sm:text-[5.5vw] md:text-[5vw] lg:text-[4vw] font-normal leading-[1.15] tracking-tight font-ppeditorial text-center">
          <span
            className="fill-line block text-center will-change-[background-position]"
            style={textFillStyle}
          >
            We work with designers,
          </span>
          <span
            className="fill-line block text-center will-change-[background-position]"
            style={textFillStyle}
          >
            architects and brands
          </span>
          <span
            className="fill-line block text-center will-change-[background-position]"
            style={textFillStyle}
          >
            to grow custom biomaterial
          </span>
          <span
            className="fill-line block text-center will-change-[background-position]"
            style={textFillStyle}
          >
            pieces for interiors.
          </span>
        </h2>
      </div>
    </section>
  );
}
