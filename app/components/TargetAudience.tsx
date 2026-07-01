"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionShader from "./SectionShader";
import Image from "next/image";

export interface Audience {
  title: string;
  image: string;
}

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

const STATIC_BLOBS = [
  "60% 40% 30% 70% / 60% 30% 70% 40%", // 3 curves (top-right flat)
  "30% 70% 60% 40% / 30% 60% 40% 70%", // 3 curves (top-left flat)
  "70% 30% 40% 60% / 40% 70% 30% 60%", // 3 curves (bottom-left flat)
  "60% 40% 70% 30% / 70% 30% 40% 60%", // 3 curves (bottom-right flat)
  "40% 60% 70% 30% / 30% 70% 40% 60%", // 3 curves (smooth 3-curve leaf shape)
];

export default function TargetAudience({ audiences }: { audiences: Audience[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const weWithRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();

      // Desktop: Horizontal Scroll
      mm.add("(min-width: 768px)", () => {
        // Calculate how far to scroll horizontally
        const totalScrollWidth = trackRef.current!.scrollWidth - window.innerWidth;
        const stickyHeight = totalScrollWidth * 1.2 + window.innerHeight;

        // Text fill animation
        if (headingRef.current) {
          const fillLines = headingRef.current.querySelectorAll(".fill-line");
          gsap.to(fillLines, {
            backgroundPosition: "0% 100%",
            stagger: 0.01,
            ease: "power1.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 35%",
              end: "top -50%",
              scrub: 0.5,
            },
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${stickyHeight}px`,
            scrub: 0.3,
            pin: true,
            pinSpacing: true,
            pinType: "transform",
          },
        });

        // Horizontal scroll the track
        tl.to(trackRef.current, {
          x: -totalScrollWidth,
          ease: "none",
          duration: 1,
        });

        // Slide heading off to the left as user scrolls
        if (headingRef.current) {
          tl.to(
            headingRef.current,
            {
              x: -window.innerWidth * 0.6,
              ease: "none",
              duration: 0.4,
            },
            0
          );
        }

        // "we" and "with" lines move faster
        if (weWithRef.current) {
          tl.to(
            weWithRef.current.querySelectorAll(".fast-line"),
            {
              x: -window.innerWidth * 0.1,
              ease: "none",
              duration: 0.4,
            },
            0
          );
        }

        // Parallax each card image
        const cards = gsap.utils.toArray(".audience-card") as HTMLElement[];
        cards.forEach((card, i) => {
          const img = card.querySelector("img");
          if (!img) return;

          const start = Math.max(0, (i - 1) / cards.length);
          const end = Math.min(1, (i + 2) / cards.length);

          tl.fromTo(
            img,
            { x: -30 },
            { x: 30, ease: "none", duration: end - start },
            start
          );
        });
      });

      // Mobile: Vertical Scroll
      mm.add("(max-width: 767px)", () => {
        // Text fill animation
        if (headingRef.current) {
          const fillLines = headingRef.current.querySelectorAll(".fill-line");
          gsap.to(fillLines, {
            backgroundPosition: "0% 100%",
            stagger: 0.1,
            ease: "power1.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 65%",
              end: "bottom 15%",
              scrub: 1,
            },
          });

          // Elegant scroll-triggered horizontal slide: slide-left from left, slide-right from right
          const leftLines = headingRef.current.querySelectorAll(".slide-left");
          const rightLines = headingRef.current.querySelectorAll(".slide-right");

          gsap.fromTo(
            leftLines,
            { x: -45 },
            {
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: headingRef.current,
                start: "top 65%",
                end: "bottom 15%",
                scrub: 1,
              },
            }
          );

          gsap.fromTo(
            rightLines,
            { x: 45 },
            {
              x: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: headingRef.current,
                start: "top 65%",
                end: "bottom 15%",
                scrub: 1,
              },
            }
          );
        }

        // Simple vertical parallax for card images
        const cards = gsap.utils.toArray(".audience-card") as HTMLElement[];
        cards.forEach((card) => {
          const img = card.querySelector("img");
          if (!img) return;
          gsap.fromTo(
            img,
            { y: -20 },
            {
              y: 20,
              ease: "none",
              scrollTrigger: {
                trigger: card as HTMLElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="target-audience-scroll"
      ref={sectionRef}
      className="relative w-full md:h-screen bg-[#12110E] md:overflow-hidden pt-36 pb-16 md:py-0"
    >
      {/* Wrapper to fix SectionShader sizing and positioning on mobile */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <div id="target-audience-shader-size" className="sticky top-0 w-full h-screen">
          <SectionShader
            color="#ffffff"
            scrollTarget="#target-audience-scroll"
            sizeTarget="#target-audience-shader-size"
            speed={1.13}
          />
        </div>
      </div>

      {/* Heading — left on desktop, centered/top on mobile */}
      <div
        ref={(el) => {
          headingRef.current = el;
          weWithRef.current = el;
        }}
        className="w-full flex flex-col items-center justify-center z-20 pointer-events-none will-change-transform mb-16 md:mb-0 px-6 md:px-0 pt-8 md:pt-0 md:absolute md:left-24 md:top-1/2 md:-translate-y-1/2 md:w-auto md:block"
      >
        <h2 className="text-[15vw] xs:text-[14vw] sm:text-[13vw] md:text-[8vw] font-normal tracking-tight leading-[1.05] w-fit text-left">
          <span
            className="fill-line slide-left block text-left pl-[2vw] md:pl-0 will-change-[background-position,transform]"
            style={textFillStyle}
          >
            who
          </span>
          <span
            className="fill-line slide-right fast-line block text-left pl-[20vw] md:pl-[12vw] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            we
          </span>
          <span
            className="fill-line slide-left block text-left pl-[2vw] md:pl-0 will-change-[background-position,transform]"
            style={textFillStyle}
          >
            work
          </span>
          <span
            className="fill-line slide-right fast-line block text-left pl-[20vw] md:pl-[12vw] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            with
          </span>
        </h2>
      </div>

      {/* Track — horizontal scroll on desktop, vertical stack on mobile */}
      <div
        ref={trackRef}
        className="md:absolute md:top-0 md:left-0 md:h-full flex flex-col md:flex-row items-center will-change-transform w-full md:w-auto md:pl-[42vw] md:pr-[4vw]"
      >
        {/* Cards container */}
        <div className="flex flex-col md:flex-row items-center gap-20 md:gap-24 h-full py-0 md:py-12 w-full px-6 md:px-0">
          {audiences.map((item, i) => (
            <div
              key={i}
              className="shrink-0 w-full md:w-[35vw] flex flex-col gap-4 group"
            >
              {/* Image Wrapper */}
              <div 
                className="audience-card relative w-full h-[55vh] md:h-[50vh] overflow-hidden border border-white/5 skeleton-shimmer-dark"
                style={{
                  borderRadius: STATIC_BLOBS[i % STATIC_BLOBS.length]
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  unoptimized
                  className="object-cover scale-[1.2] will-change-transform"
                />
              </div>
              {/* Title below image */}
              <div className="text-center w-full">
                <span className="text-white text-[5.5vw] md:text-[1.8vw] font-normal tracking-tight leading-[1.1]">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
