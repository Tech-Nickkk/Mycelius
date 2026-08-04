"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const headingTextFillStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #ffffff 49.8%, rgba(255, 255, 255, 0.15) 50.2%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

const headingTextFillStyleOrange: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #F15B20 49.8%, rgba(241, 91, 32, 0.25) 50.2%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

interface LogoItem {
  name: string;
  icon: ReactNode;
  link?: string;
}

const LOGOS: LogoItem[] = [
  // Row 1 (Top 5)
  {
    name: "DSV",
    icon: (
      <svg viewBox="0 0 120 40" className="h-8 md:h-11 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="60%" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="28" letterSpacing="-1.5">DSV</text>
      </svg>
    )
  },
  {
    name: "Lineage",
    icon: (
      <svg viewBox="0 0 150 40" className="h-7 md:h-10 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(25, 8)" stroke="currentColor" fill="none">
          <path d="M 0,0 L 20,0 L 10,24 Z" strokeWidth="2"/>
          <path d="M 4,6 L 16,6 M 6,12 L 14,12 M 8,18 L 12,18" strokeWidth="1.5"/>
        </g>
        <text x="55" y="27" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold">Lineage</text>
      </svg>
    )
  },
  {
    name: "Goodyear",
    icon: (
      <svg viewBox="0 0 180 40" className="h-7 md:h-9 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <text x="15" y="28" fontFamily="'Arial Black', Impact, sans-serif" fontStyle="italic" fontWeight="900" fontSize="16" letterSpacing="0.5">GOOD</text>
        <g transform="translate(75, 8)" stroke="currentColor" fill="none">
          <path d="M -3 10 C 1 10, 4 13, 6 16 C 7 18, 4 22, -1 22 C -6 22, -9 18, -6 14 C -5 12, -4 10, -3 10 Z M 6 16 L 19 16 L 15 20 L 6 16" strokeWidth="1.5"/>
        </g>
        <text x="105" y="28" fontFamily="'Arial Black', Impact, sans-serif" fontStyle="italic" fontWeight="900" fontSize="16" letterSpacing="0.5">YEAR</text>
      </svg>
    )
  },
  {
    name: "Ocean Spray",
    icon: (
      <svg viewBox="0 0 140 40" className="h-9 md:h-12 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="70" cy="20" rx="42" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <text x="70" y="25" textAnchor="middle" fontFamily="'Times New Roman', serif" fontStyle="italic" fontWeight="bold" fontSize="12">Ocean Spray</text>
      </svg>
    )
  },
  {
    name: "Culligan",
    icon: (
      <svg viewBox="0 0 140 40" className="h-8 md:h-11 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="60%" textAnchor="middle" fontFamily="'Brush Script MT', cursive, sans-serif" fontSize="28">Culligan</text>
      </svg>
    )
  },
  // Row 2 (Bottom 5)
  {
    name: "Vince",
    icon: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="60%" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="300" fontSize="20" letterSpacing="4">VINCE.</text>
      </svg>
    )
  },
  {
    name: "Stanley",
    icon: (
      <svg viewBox="0 0 150 40" className="h-8 md:h-10 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(15, 8)" fill="none" stroke="currentColor">
          <rect x="2" y="2" width="18" height="18" strokeWidth="1.5"/>
          <path d="M 6 16 L 14 16 L 10 8 Z" fill="currentColor"/>
        </g>
        <text x="45" y="27" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="16" letterSpacing="1">STANLEY</text>
      </svg>
    )
  },
  {
    name: "RAC",
    icon: (
      <svg viewBox="0 0 40 40" className="h-9 md:h-12 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
        <circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" strokeWidth="1"/>
        <text x="20" y="25" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="10" letterSpacing="0.5">RAC</text>
      </svg>
    )
  },
  {
    name: "Marc Jacobs",
    icon: (
      <svg viewBox="0 0 180 40" className="h-6 md:h-8 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="60%" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="500" fontSize="15" letterSpacing="3">MARC JACOBS</text>
      </svg>
    )
  },
  {
    name: "PODS",
    icon: (
      <svg viewBox="0 0 120 40" className="h-8 md:h-10 w-auto text-white/30 group-hover:text-white transition-colors duration-500 fill-current" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="6" width="110" height="28" fill="currentColor" rx="2" />
        <text x="60" y="28" textAnchor="middle" fontFamily="'Arial Black', sans-serif" fontWeight="900" fontSize="18" fill="#12110E" letterSpacing="1">PODS</text>
      </svg>
    )
  }
];

export interface IncubatorItem {
  name: string;
  logo: string;
  link?: string;
}

export default function Incubators({ items }: { items?: IncubatorItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowGridRef1 = useRef<HTMLDivElement>(null);
  const glowGridRef2 = useRef<HTMLDivElement>(null);

  // Dynamically resolve logos: use items from Sanity if provided (overriding with matching static SVGs for optimal aesthetics), otherwise fall back to static defaults
  const resolvedLogos: LogoItem[] = items && items.length > 0
    ? items.map(item => {
        const staticMatch = LOGOS.find(l => l.name.toLowerCase() === item.name.toLowerCase());
        if (staticMatch) {
          return {
            ...staticMatch,
            link: item.link
          };
        }
        return {
          name: item.name,
          link: item.link,
          icon: (
            <Image 
              src={item.logo} 
              alt={item.name} 
              width={300}
              height={128}
              unoptimized
              className="h-full w-auto max-w-[98%] p-2 object-contain filter brightness-0 invert opacity-45 group-hover:opacity-100 transition-all duration-500" 
            />
          )
        };
      })
    : LOGOS;

  // Pad the list of logos if it's too short, ensuring both rows are filled and the marquee animation doesn't break
  let paddedLogos = [...resolvedLogos];
  if (paddedLogos.length > 0) {
    while (paddedLogos.length < 10) {
      paddedLogos = [...paddedLogos, ...resolvedLogos];
    }
  }

  const half = Math.ceil(paddedLogos.length / 2);
  const row1Base = paddedLogos.slice(0, half);
  const row2Base = paddedLogos.slice(half);

  // Duplicate lists for seamless loop (repeated 4 times to ensure it covers wide screens without gaps)
  const row1Logos = [
    ...row1Base,
    ...row1Base,
    ...row1Base,
    ...row1Base
  ];
  const row2Logos = [
    ...row2Base,
    ...row2Base,
    ...row2Base,
    ...row2Base
  ];

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e: MouseEvent) => {
      const glow1 = glowGridRef1.current;
      const glow2 = glowGridRef2.current;

      if (glow1) {
        glow1.style.opacity = "0.5";
        const rect1 = glow1.getBoundingClientRect();
        const mouseX1 = e.clientX - rect1.left;
        const mouseY1 = e.clientY - rect1.top;
        const mask1 = `radial-gradient(circle 120px at ${mouseX1}px ${mouseY1}px, black 0%, black 50%, transparent 100%)`;
        glow1.style.webkitMaskImage = mask1;
        glow1.style.maskImage = mask1;
      }

      if (glow2) {
        glow2.style.opacity = "0.5";
        const rect2 = glow2.getBoundingClientRect();
        const mouseX2 = e.clientX - rect2.left;
        const mouseY2 = e.clientY - rect2.top;
        const mask2 = `radial-gradient(circle 120px at ${mouseX2}px ${mouseY2}px, black 0%, black 50%, transparent 100%)`;
        glow2.style.webkitMaskImage = mask2;
        glow2.style.maskImage = mask2;
      }
    };

    const handleMouseLeave = () => {
      const glow1 = glowGridRef1.current;
      const glow2 = glowGridRef2.current;
      if (glow1) glow1.style.opacity = "0";
      if (glow2) glow2.style.opacity = "0";
    };

    grid.addEventListener("mousemove", handleMouseMove);
    grid.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      grid.removeEventListener("mousemove", handleMouseMove);
      grid.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="incubators"
      className="relative w-full bg-[#12110E] py-20 md:py-36 overflow-hidden"
    >
      {/* Styles for seamless marquee loop */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scrollLeft 45s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRight 45s linear infinite;
        }
      `}} />

      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center">
        {/* Animated heading */}
        <div
          ref={headingRef}
          className="w-full flex flex-col items-center justify-center z-20 pointer-events-none will-change-transform mb-16 md:mb-24 px-6 md:px-0"
        >
          <h2 className="text-[8.5vw] xs:text-[7.5vw] sm:text-[6.5vw] md:text-[4.4vw] font-extralight font-kodchasan tracking-tight leading-[1.25] w-fit text-center">
            <span
              className="fill-line inline-block pb-[0.2em] will-change-[background-position,transform]"
              style={headingTextFillStyle}
            >
              Who&rsquo;s Watching&nbsp;
            </span>
            <span className="whitespace-nowrap inline-block">
              <span
                className="fill-line inline-block pb-[0.2em] will-change-[background-position,transform]"
                style={headingTextFillStyle}
              >
                Us&nbsp;
              </span>
              <span
                className="fill-line inline-block pb-[0.2em] will-change-[background-position,transform]"
                style={headingTextFillStyleOrange}
              >
                Grow
              </span>
            </span>
          </h2>
          <p className="text-white/50 text-xs sm:text-sm font-extralight font-avenir-next tracking-[0.25em] text-center mt-1.5 uppercase">
            The ones who believed first.
          </p>
        </div>

        {/* Blueprint Layout Grid Container */}
        <div 
          ref={gridRef} 
          className="relative w-full py-8 select-none"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 120px, black calc(100% - 120px), transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 120px, black calc(100% - 120px), transparent)"
          }}
        >
          {/* Row 1 (Moving Left) */}
          <div className="scroll-row relative w-full overflow-hidden -mb-px">
            {/* Base Row (White) */}
            <div className="flex w-max animate-scroll-left">
              {row1Logos.map((item, idx) => {
                const isLink = !!item.link;
                const Component = isLink ? 'a' : 'div';
                const linkProps = isLink ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};
                return (
                  <Component 
                    key={`r1-base-${idx}`}
                    {...linkProps}
                    className="group relative flex items-center justify-center w-40 md:w-60 h-20 md:h-32 border-t border-r border-white/8 shrink-0 cursor-pointer select-none"
                  >
                    {/* Soft Orange Hover Background */}
                    <div className="absolute inset-0 bg-[#F15B20]/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Crosshair top-right */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-white/20 font-light text-[10px] pointer-events-none select-none">+</div>
                    
                    {item.icon}
                  </Component>
                );
              })}
            </div>

            {/* Glow Row Overlay (Orange, masked by mouse position) */}
            <div 
              ref={glowGridRef1}
              className="absolute inset-0 flex w-max animate-scroll-left pointer-events-none opacity-0 transition-opacity duration-300 z-10"
              style={{
                WebkitMaskImage: "radial-gradient(circle 120px at 0px 0px, black, transparent)",
                maskImage: "radial-gradient(circle 120px at 0px 0px, black, transparent)"
              }}
            >
              {row1Logos.map((item, idx) => (
                <div 
                  key={`r1-glow-${idx}`}
                  className="relative flex items-center justify-center w-40 md:w-60 h-20 md:h-32 border-t-2 border-r-2 border-[#F15B20] shrink-0"
                >
                  {/* Crosshair top-right (Orange) */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-[#F15B20] font-light text-[10px] pointer-events-none select-none">+</div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 (Moving Right) */}
          <div className="scroll-row relative w-full overflow-hidden">
            {/* Base Row (White) */}
            <div className="flex w-max animate-scroll-right">
              {row2Logos.map((item, idx) => {
                const isLink = !!item.link;
                const Component = isLink ? 'a' : 'div';
                const linkProps = isLink ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};
                return (
                  <Component 
                    key={`r2-base-${idx}`}
                    {...linkProps}
                    className="group relative flex items-center justify-center w-40 md:w-60 h-20 md:h-32 border-t border-b border-r border-white/8 shrink-0 cursor-pointer select-none"
                  >
                    {/* Soft Orange Hover Background */}
                    <div className="absolute inset-0 bg-[#F15B20]/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {/* Crosshair top-right */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-white/20 font-light text-[10px] pointer-events-none select-none">+</div>
                    
                    {/* Crosshair bottom-right */}
                    <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 text-white/20 font-light text-[10px] pointer-events-none select-none">+</div>
                    
                    {item.icon}
                  </Component>
                );
              })}
            </div>

            {/* Glow Row Overlay (Orange, masked by mouse position) */}
            <div 
              ref={glowGridRef2}
              className="absolute inset-0 flex w-max animate-scroll-right pointer-events-none opacity-0 transition-opacity duration-300 z-10"
              style={{
                WebkitMaskImage: "radial-gradient(circle 120px at 0px 0px, black, transparent)",
                maskImage: "radial-gradient(circle 120px at 0px 0px, black, transparent)"
              }}
            >
              {row2Logos.map((item, idx) => (
                <div 
                  key={`r2-glow-${idx}`}
                  className="relative flex items-center justify-center w-40 md:w-60 h-20 md:h-32 border-t-2 border-b-2 border-r-2 border-[#F15B20] shrink-0"
                >
                  {/* Crosshair top-right (Orange) */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 text-[#F15B20] font-light text-[10px] pointer-events-none select-none">+</div>
                  {/* Crosshair bottom-right (Orange) */}
                  <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 text-[#F15B20] font-light text-[10px] pointer-events-none select-none">+</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
