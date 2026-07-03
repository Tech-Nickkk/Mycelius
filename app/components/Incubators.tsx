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
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-[#F15B20] transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5S4.5 14.5 4.5 12zm10.5 0c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5-4.5-2-4.5-4.5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    )
  },
  {
    name: "EcoVentures",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-[#F15B20] transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.5 7 6 10 6 13c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2.5-6-6-11z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 7c-1.5 2.5-3 4-3 6 0 1.7 1.3 3 3 3s3-1.3 3-3c0-2-1.5-3.5-3-6z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      </svg>
    )
  },
  {
    name: "DeepTech Labs",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-[#F15B20] transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 6v12M3.34 7l17.32 10M20.66 7L3.34 17" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      </svg>
    )
  },
  {
    name: "Nova Inc.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-[#F15B20] fill-current transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c0 5.5 4.5 10 10 10-5.5 0-10 4.5-10 10-0-5.5-4.5-10-10-10 5.5 0 10-4.5 10-10z" />
      </svg>
    )
  },
  {
    name: "GreenGrowth",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-[#F15B20] transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22V10M12 14c2-2 4-2 6-4M12 12c-2-2-4-2-6-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="18" cy="10" r="1.5" fill="currentColor" />
        <circle cx="6" cy="8" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    name: "FutureMatter",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8 text-white/30 group-hover:text-[#F15B20] transition-colors duration-500" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
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
        <div className="relative w-full overflow-hidden py-8 select-none">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-48 bg-linear-to-r from-[#12110E] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-48 bg-linear-to-l from-[#12110E] to-transparent z-10" />

          {/* Scrolling Track */}
          <div className="flex items-center animate-marquee">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((item, idx) => (
              <div key={idx} className="flex items-center shrink-0 gap-6 md:gap-10">
                <div className="flex items-center gap-3.5 md:gap-5 group cursor-pointer">
                  {item.icon}
                  <span className="text-white/30 font-sans text-[11px] md:text-[13.5px] tracking-[0.3em] md:tracking-[0.4em] font-semibold uppercase group-hover:text-white/80 transition-colors duration-500">
                    {item.name}
                  </span>
                </div>
                {/* Separator with right margin to make total width perfectly symmetric */}
                <span className="text-white/10 text-xs md:text-sm select-none pr-6 md:pr-10">
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
