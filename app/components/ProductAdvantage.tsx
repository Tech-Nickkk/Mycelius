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
  { title: "Natural Insulation", iconPath: "/natural-insulation-icon.png", filter: "invert(1)" },
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

      // Calculate how far to scroll horizontally
      const totalScrollWidth =
        trackRef.current.scrollWidth - window.innerWidth;

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
      const arrows = trackRef.current.querySelectorAll(".reveal-arrow");
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="product-advantage-scroll"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#12110E] overflow-hidden"
    >
      {/* Left-side heading — slides out as you scroll */}
      <div
        ref={(el) => {
          headingRef.current = el;
          weWithRef.current = el;
        }}
        className="absolute left-16 md:left-24 top-1/2 -translate-y-1/2 z-20 pointer-events-none will-change-transform"
      >
        <h1 className="text-[14vw] md:text-[8vw] font-normal tracking-tight leading-[1.05]">
          <span
            className="fill-line block text-left will-change-[background-position]"
            style={headingTextFillStyle}
          >
            Our
          </span>
          <span
            className="fill-line fast-line block pl-[18vw] md:pl-[12vw] will-change-[background-position,transform]"
            style={headingTextFillStyle}
          >
            Products
          </span>
          <span
            className="fill-line block text-left will-change-[background-position]"
            style={headingTextFillStyle}
          >
            Are
          </span>
        </h1>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex items-center will-change-transform"
        style={{ paddingLeft: "58vw", paddingRight: "4vw" }}
      >
        {/* Cards row */}
        <div className="flex items-center gap-6 md:gap-8 h-full py-12">
          {ADVANTAGES_DATA.map((item, idx) => (
            <Fragment key={idx}>
              {/* Product Content (no background card) */}
              <div
                className="relative shrink-0 w-[65vw] md:w-[24vw] h-[50vh] md:h-[55vh] flex flex-col justify-center items-center gap-8 px-6 select-none"
              >
                {/* Icon Container */}
                <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                  <Image
                    src={item.iconPath}
                    alt={`${item.title} icon`}
                    fill
                    sizes="(max-width: 768px) 160px, 224px"
                    className={`object-contain ${
                      item.title === "Made in India"
                        ? "scale-140 md:scale-130"
                        : ""
                    }`}
                    style={{ filter: item.filter }}
                  />
                </div>

                {/* Text below logo */}
                <span className="text-white text-[5vw] md:text-[2vw] font-normal tracking-tight leading-[1.1] font-sans text-center whitespace-nowrap">
                  {item.title}
                </span>
              </div>

              {/* Arrow pointing to next (except after last card) */}
              {idx < ADVANTAGES_DATA.length - 1 && (
                <div className="shrink-0 w-[12vw] md:w-[8vw] flex items-center justify-center">
                  <span
                    className="reveal-arrow text-[8vw] md:text-[5vw] font-light leading-none will-change-[background-position]"
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
