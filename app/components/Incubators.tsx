"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const LOGOS = [
  {
    name: "BioLabs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-white/30 fill-current group-hover:text-white/70 transition-colors duration-300">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/>
      </svg>
    )
  },
  {
    name: "EcoVentures",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-white/30 fill-current group-hover:text-white/70 transition-colors duration-300">
        <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm-4 9.5c0-2.21 1.79-4 4-4s4 1.79 4 4H8z"/>
      </svg>
    )
  },
  {
    name: "DeepTech Labs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-white/30 fill-current group-hover:text-white/70 transition-colors duration-300">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    )
  },
  {
    name: "Nova Inc.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-white/30 fill-current group-hover:text-white/70 transition-colors duration-300">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z"/>
      </svg>
    )
  },
  {
    name: "GreenGrowth",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-white/30 fill-current group-hover:text-white/70 transition-colors duration-300">
        <path d="M17 8C14.24 8 12 10.24 12 13c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm-10 4c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5c0-2.76-2.24-5-5-5zm5-8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5c0-2.76-2.24-5-5-5z"/>
      </svg>
    )
  },
  {
    name: "FutureMatter",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6 text-white/30 fill-current group-hover:text-white/70 transition-colors duration-300">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"/>
      </svg>
    )
  }
];

export default function Incubators() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !headingRef.current) return;

      // Text fill animation
      const fillLines = headingRef.current.querySelectorAll(".fill-line");
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#12110E] py-16 md:py-36 overflow-hidden"
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center">
        {/* Animated heading */}
        <div
          ref={headingRef}
          className="w-full flex flex-col items-center justify-center z-20 pointer-events-none will-change-transform mb-12 md:mb-32 px-6 md:px-0"
        >
          <h2 className="text-[15vw] xs:text-[14vw] sm:text-[13vw] md:text-[8vw] font-normal tracking-tight leading-[1.05] w-fit text-center">
            <span
              className="fill-line block text-center will-change-[background-position,transform]"
              style={headingTextFillStyle}
            >
              Incubators
            </span>
          </h2>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-48 bg-gradient-to-r from-[#12110E] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-48 bg-gradient-to-l from-[#12110E] to-transparent z-10" />

          {/* Scrolling Track */}
          <div className="flex gap-6 md:gap-16 animate-marquee">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 md:gap-3 px-5 py-3 md:px-8 md:py-4 bg-[#1C1B19]/30 border border-white/5 rounded-full backdrop-blur-sm group hover:bg-[#1C1B19]/60 hover:border-white/10 transition-all duration-300"
              >
                {item.icon}
                <span className="text-white/30 font-sans text-[10px] md:text-xs tracking-[0.25em] font-semibold uppercase group-hover:text-white/70 transition-colors duration-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
