"use client";

import { useRef } from "react";
import Image from "next/image";
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
  const leftMushroomRef = useRef<HTMLDivElement>(null);
  const rightMushroomRef = useRef<HTMLDivElement>(null);

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

      // Generate distinct random rotation ranges for each mushroom to ensure a completely unique scroll feel
      const leftRotStart = -5 - Math.random() * 10;      // Starts at -5 to -15 deg (leaning left)
      const leftRotEnd = -40 - Math.random() * 20;       // Rotates counter-clockwise to -40 to -60 deg

      const rightRotStart = 5 + Math.random() * 10;      // Starts at 5 to 15 deg (leaning right)
      const rightRotEnd = 40 + Math.random() * 20;       // Rotates clockwise to 40 to 60 deg

      // Parallax scroll effects for background mushrooms
      if (leftMushroomRef.current) {
        gsap.fromTo(
          leftMushroomRef.current,
          { y: 120, rotation: leftRotStart },
          {
            y: -150,
            rotation: leftRotEnd,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      if (rightMushroomRef.current) {
        gsap.fromTo(
          rightMushroomRef.current,
          { y: 200, rotation: rightRotStart },
          {
            y: -180,
            rotation: rightRotEnd,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="collaborations-section"
      className="relative w-full min-h-[50vh] md:h-screen bg-[#12110E] flex items-center justify-center py-12 md:py-0 px-6 md:px-16 lg:px-24 select-none z-30"
    >
      {/* Background Mushrooms with Parallax */}
      <div
        ref={leftMushroomRef}
        className="absolute top-[10%] left-[5%] w-28 h-28 md:w-48 md:h-48 pointer-events-none z-10 opacity-[0.1] select-none"
        style={{ filter: "brightness(0) invert(1)" }}
      >
        <Image
          src="/mushroom.png"
          alt="Mushroom background decoration left"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 112px, 192px"
        />
      </div>

      <div
        ref={rightMushroomRef}
        className="absolute bottom-[3%] right-[5%] w-32 h-32 md:w-52 md:h-52 pointer-events-none z-10 opacity-[0.1] select-none"
        style={{ filter: "brightness(0) invert(1)" }}
      >
        <Image
          src="/mushroom.png"
          alt="Mushroom background decoration right"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 128px, 208px"
        />
      </div>

      {/* Core Typography Statement */}
      <div ref={headingRef} className="max-w-6xl w-full relative z-20">
        <h2 className="text-[5vw] xs:text-[4.5vw] sm:text-[4vw] md:text-[3.6vw] lg:text-[3.3vw] xl:text-[44px] 2xl:text-[50px] font-normal leading-[1.25] tracking-tight text-center">
          <span
            className="fill-line block text-center will-change-[background-position] md:whitespace-nowrap"
            style={textFillStyle}
          >
            Strictly for designers allergic to déjà vu.
          </span>
          <span
            className="fill-line block text-center will-change-[background-position] md:whitespace-nowrap"
            style={textFillStyle}
          >
            Custom biomaterial pieces, grown for interiors.
          </span>
        </h2>
      </div>
    </section>
  );
}
