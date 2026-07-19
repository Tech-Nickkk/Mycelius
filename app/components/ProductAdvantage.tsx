"use client";

import { useRef, Fragment } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

interface AdvantageItem {
  title: string;
  iconPath: string;
  filter: string;
}

const ADVANTAGES_DATA: AdvantageItem[] = [
  { title: "Biodegradable", iconPath: "/biodegradable-icon.png", filter: "invert(1)" },
  { title: "Non-Toxic", iconPath: "/non-toxic-icon.png", filter: "invert(1)" },
  { title: "Fire Retardant", iconPath: "/fire-retardant-icon.png", filter: "invert(1)" },
  { title: "Thermal Insulation", iconPath: "/natural-insulation-icon.png", filter: "invert(1)" },
  { title: "Acoustic Absorption", iconPath: "/acoustic_absorption_icon.png", filter: "invert(1)" },
  { title: "Bespoke Design", iconPath: "/bespoke_design_icon.png", filter: "invert(1)" },
  { title: "Made in India", iconPath: "/made-in-india-icon.png", filter: "none" },
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

const horizontalTextFillStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #ffffff 50%, rgba(255, 255, 255, 0.15) 50%)",
  backgroundSize: "200% 100%",
  backgroundPosition: "100% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

export default function ProductAdvantage() {
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
        const totalScrollWidth =
          trackRef.current!.scrollWidth - window.innerWidth;

        // Extra scroll room so the movement feels slower and smoother
        const stickyHeight = totalScrollWidth * 1.2 + window.innerHeight;

        // Text fill animation (plays as the section enters the viewport, before pinning - bottom to top)
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

        // Animate each arrow exactly as it enters the viewport
        const arrows = trackRef.current!.querySelectorAll(".reveal-arrow");
        arrows.forEach((arrow) => {
          const arrowEl = arrow as HTMLElement;
          const trackRect = trackRef.current!.getBoundingClientRect();
          const arrowRect = arrowEl.getBoundingClientRect();
          const arrowLeftRelativeToTrack = arrowRect.left - trackRect.left;

          // Start the transition when the arrow is at 70% of the screen width (well in view)
          const startScroll = arrowLeftRelativeToTrack - window.innerWidth * 0.7;
          // Finish when the arrow is at 50% of the screen width (centered in the viewport)
          const endScroll = arrowLeftRelativeToTrack - window.innerWidth * 0.5;

          // Map scroll offsets to timeline positions (timeline duration is 1.0)
          const startPos = Math.max(0, startScroll / totalScrollWidth);
          const endPos = Math.min(1, endScroll / totalScrollWidth);
          const animDuration = Math.max(0.05, endPos - startPos);

          tl.to(arrowEl, {
            backgroundPosition: "0% 0%",
            ease: "power1.out",
            duration: animDuration,
          }, startPos);
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

        // "Products" line moves faster
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
              start: "top 85%",
              end: "bottom 45%",
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
                start: "top 85%",
                end: "bottom 45%",
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
                start: "top 85%",
                end: "bottom 45%",
                scrub: 1,
              },
            }
          );
        }

        // Mobile Arrows reveal (pointing down)
        const arrows = trackRef.current?.querySelectorAll(".reveal-arrow");
        arrows?.forEach((arrow) => {
          gsap.to(arrow, {
            backgroundPosition: "0% 0%",
            ease: "power1.out",
            scrollTrigger: {
              trigger: arrow,
              start: "top 85%",
              end: "bottom 60%",
              scrub: true,
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="product-advantage-scroll"
      ref={sectionRef}
      className="relative w-full md:h-screen bg-[#12110E] md:overflow-hidden pt-36 pb-8 md:py-0"
    >
      {/* Left-side heading — slides out as you scroll */}
      <div
        ref={(el) => {
          headingRef.current = el;
          weWithRef.current = el;
        }}
        className="w-full flex flex-col items-center justify-center z-20 pointer-events-none will-change-transform mb-8 md:mb-0 px-6 md:px-0 pt-8 md:pt-0 md:absolute md:left-24 md:top-1/2 md:-translate-y-1/2 md:w-auto md:block"
      >
        <h1 className="text-[15vw] xs:text-[14vw] sm:text-[13vw] md:text-[8vw] font-normal tracking-tight leading-[1.05] w-fit text-left">
          <span
            className="fill-line slide-left block text-left pl-[8vw] md:pl-0 will-change-[background-position,transform]"
            style={headingTextFillStyle}
          >
            Grown
          </span>
          <span
            className="fill-line slide-right fast-line block text-left pl-[28vw] md:pl-[18vw] will-change-[background-position,transform]"
            style={headingTextFillStyle}
          >
            to
          </span>
          <span
            className="fill-line slide-left block text-left pl-[8vw] md:pl-0 will-change-[background-position,transform]"
            style={headingTextFillStyle}
          >
            Perform
          </span>
        </h1>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="md:absolute md:top-0 md:left-0 md:h-full flex flex-col md:flex-row items-center will-change-transform w-full md:w-auto md:pl-[46vw] md:pr-[4vw]"
      >
        {/* Cards row */}
        <div className="flex flex-col md:flex-row items-center gap-0 md:gap-6 h-full py-0 md:py-12 w-full px-6 md:px-0">
          {ADVANTAGES_DATA.map((item, idx) => (
            <Fragment key={idx}>
              {/* Product Content (no background card) */}
              <div
                className="relative shrink-0 w-full md:w-[24vw] h-[40vh] md:h-[55vh] flex flex-col justify-center items-center gap-6 md:gap-8 px-6 select-none"
              >
                {/* Icon Container */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                  <Image
                    src={item.iconPath}
                    alt={`${item.title} icon`}
                    fill
                    sizes="(max-width: 768px) 160px, 224px"
                    className={`object-contain ${item.title === "Made in India"
                        ? "scale-140 md:scale-130"
                        : ""
                      }`}
                    style={{ filter: item.filter }}
                  />
                </div>

                {/* Text below logo */}
                <span className="text-white text-[5.5vw] md:text-[2vw] font-normal tracking-tight leading-[1.1] font-sans text-center whitespace-nowrap">
                  {item.title}
                </span>
              </div>

              {/* Arrow pointing to next (except after last card) */}
              {idx < ADVANTAGES_DATA.length - 1 && (
                <div className="shrink-0 flex items-center justify-center w-[20vw] h-[20vw] md:w-auto md:h-auto my-4 md:my-0">
                  <span
                    className="reveal-arrow text-[15vw] md:text-[5vw] font-light leading-none will-change-[background-position] rotate-90 md:rotate-0 inline-block origin-center"
                    style={horizontalTextFillStyle}
                  >
                    &rarr;
                  </span>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
