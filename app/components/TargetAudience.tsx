"use client";

import { useRef, Fragment } from "react";
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
    "linear-gradient(to top, #ffffff 49.8%, rgba(255, 255, 255, 0.15) 50.2%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

const textFillStyleOrange: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #F15B20 49.8%, rgba(241, 91, 32, 0.25) 50.2%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};


const r = (n: number) => Math.round(n * 1000) / 1000;

const getClipPathD = (xTop: number, xBottom: number) => {
  const w = 0.45; // notch width
  const c = 0.08; // transition width
  
  // Top notch (indented down to y = 0.08)
  const x1_top = r(xTop - w / 2);
  const x2_top = r(x1_top + c);
  const x3_top = r(xTop + w / 2 - c);
  const x4_top = r(xTop + w / 2);

  // Bottom notch (indented up to y = 0.92)
  const x1_bot = r(xBottom - w / 2);
  const x2_bot = r(x1_bot + c);
  const x3_bot = r(xBottom + w / 2 - c);
  const x4_bot = r(xBottom + w / 2);

  return `M 0,0.04 ` +
    `C 0,0.02 0.02,0 0.04,0 ` +
    `L ${x1_top},0 ` +
    `C ${r(x1_top + c*0.4)},0 ${r(x1_top + c*0.6)},0.08 ${x2_top},0.08 ` +
    `L ${x3_top},0.08 ` +
    `C ${r(x4_top - c*0.6)},0.08 ${r(x4_top - c*0.4)},0 ${x4_top},0 ` +
    `L 0.96,0 ` +
    `C 0.98,0 1,0.02 1,0.04 ` +
    `L 1,0.96 ` +
    `C 1,0.98 0.98,1 0.96,1 ` +
    `L ${x4_bot},1 ` +
    `C ${r(x4_bot - c*0.4)},1 ${r(x4_bot - c*0.6)},0.92 ${x3_bot},0.92 ` +
    `L ${x2_bot},0.92 ` +
    `C ${r(x1_bot + c*0.6)},0.92 ${r(x1_bot + c*0.4)},1 ${x1_bot},1 ` +
    `L 0.04,1 ` +
    `C 0.02,1 0,0.98 0,0.96 ` +
    `Z`;
};

const getClipPathMobileD = (yLeft: number, yRight: number) => {
  const w = 0.45; // notch width (vertical height)
  const c = 0.08; // transition width
  
  // Right notch (indented left to x = 0.92)
  const y1_right = r(yRight - w / 2);
  const y2_right = r(y1_right + c);
  const y3_right = r(yRight + w / 2 - c);
  const y4_right = r(yRight + w / 2);

  // Left notch (indented right to x = 0.08)
  const y1_left = r(yLeft - w / 2);
  const y2_left = r(y1_left + c);
  const y3_left = r(yLeft + w / 2 - c);
  const y4_left = r(yLeft + w / 2);

  return `M 0,0.04 ` +
    `C 0,0.02 0.02,0 0.04,0 ` +
    `L 0.96,0 ` +
    `C 0.98,0 1,0.02 1,0.04 ` +
    `L 1,${y1_right} ` +
    `C 1,${r(y1_right + c*0.4)} 0.92,${r(y1_right + c*0.6)} 0.92,${y2_right} ` +
    `L 0.92,${y3_right} ` +
    `C 0.92,${r(y4_right - c*0.6)} 1,${r(y4_right - c*0.4)} 1,${y4_right} ` +
    `L 1,0.96 ` +
    `C 1,0.98 0.98,1 0.96,1 ` +
    `L 0.04,1 ` +
    `C 0.02,1 0,0.98 0,0.96 ` +
    `L 0,${y4_left} ` +
    `C 0,${r(y4_left - c*0.4)} 0.08,${r(y4_left - c*0.6)} 0.08,${y3_left} ` +
    `L 0.08,${y2_left} ` +
    `C 0.08,${r(y1_left + c*0.6)} 0,${r(y1_left + c*0.4)} 0,${y1_left} ` +
    `Z`;
};

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

        // Parallax each card image and animate notch clip paths
        const cards = gsap.utils.toArray(".audience-card") as HTMLElement[];
        cards.forEach((card, i) => {
          const img = card.querySelector("img");
          if (!img) return;

          const start = Math.max(0, (i - 1) / cards.length);
          const end = Math.min(1, (i + 2) / cards.length);

          // Image horizontal parallax
          tl.fromTo(
            img,
            { x: -30 },
            { x: 30, ease: "none", duration: end - start },
            start
          );

          // Notch horizontal shift: top (right to left), bottom (left to right)
          const pathEl = document.getElementById(`audience-card-path-${i}`);
          if (pathEl) {
            const animObj = { xTop: 0.7, xBot: 0.3 };
            let lastXTop = 0.7;
            let lastXBot = 0.3;
            tl.fromTo(
              animObj,
              { xTop: 0.7, xBot: 0.3 },
              {
                xTop: 0.3,
                xBot: 0.7,
                ease: "none",
                duration: end - start,
                onUpdate: () => {
                  if (Math.abs(animObj.xTop - lastXTop) > 0.004 || Math.abs(animObj.xBot - lastXBot) > 0.004) {
                    lastXTop = animObj.xTop;
                    lastXBot = animObj.xBot;
                    pathEl.setAttribute("d", getClipPathD(animObj.xTop, animObj.xBot));
                  }
                },
              },
              start
            );
          }
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

        // Simple vertical parallax and notch animation for card images
        const cards = gsap.utils.toArray(".audience-card") as HTMLElement[];
        cards.forEach((card, i) => {
          const img = card.querySelector("img");
          if (!img) return;

          // Image vertical parallax
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

          // Notch vertical shift on mobile vertical scroll: left (bottom to top), right (top to bottom)
          const pathElMobile = document.getElementById(`audience-card-path-mobile-${i}`);
          if (pathElMobile) {
            const animObj = { yLeft: 0.7, yRight: 0.3 };
            let lastYLeft = 0.7;
            let lastYRight = 0.3;
            gsap.fromTo(
              animObj,
              { yLeft: 0.7, yRight: 0.3 },
              {
                yLeft: 0.3,
                yRight: 0.7,
                ease: "none",
                scrollTrigger: {
                  trigger: card as HTMLElement,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
                onUpdate: () => {
                  if (Math.abs(animObj.yLeft - lastYLeft) > 0.004 || Math.abs(animObj.yRight - lastYRight) > 0.004) {
                    lastYLeft = animObj.yLeft;
                    lastYRight = animObj.yRight;
                    pathElMobile.setAttribute("d", getClipPathMobileD(animObj.yLeft, animObj.yRight));
                  }
                },
              }
            );
          }
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
      className="relative w-full md:h-screen md:overflow-hidden pt-36 pb-16 md:py-0"
    >
      {/* Responsive Clip Path Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        ${audiences.map((_, i) => `
          .audience-card-clip-${i} {
            clip-path: url(#audience-card-clip-mobile-${i});
          }
          @media (min-width: 768px) {
            .audience-card-clip-${i} {
              clip-path: url(#audience-card-clip-desktop-${i});
            }
          }
        `).join('\n')}
      `}} />

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
        <h2 className="text-[11.5vw] xs:text-[10.5vw] sm:text-[9.2vw] md:text-[6vw] font-extralight font-kodchasan tracking-tight uppercase leading-[1.15] w-fit text-left">
          <span
            className="fill-line slide-left block text-left pl-[2vw] md:pl-0 pb-[0.15em] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            Who
          </span>
          <span
            className="fill-line slide-right fast-line block text-left pl-[14vw] md:pl-[9vw] pb-[0.15em] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            we
          </span>
          <span
            className="fill-line slide-left block text-left pl-[2vw] md:pl-0 pb-[0.15em] will-change-[background-position,transform]"
            style={textFillStyleOrange}
          >
            Grow
          </span>
          <span
            className="fill-line slide-right fast-line block text-left pl-[14vw] md:pl-[9vw] pb-[0.15em] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            for
          </span>
        </h2>
      </div>

      {/* Track — horizontal scroll on desktop, vertical stack on mobile */}
      <div
        ref={trackRef}
        className="md:absolute md:top-0 md:left-0 md:h-full flex flex-col md:flex-row items-center will-change-transform w-full md:w-auto md:pl-[36vw] md:pr-[4vw]"
      >
        {/* Cards container */}
        <div className="flex flex-col md:flex-row items-center gap-20 md:gap-24 h-full py-0 md:py-12 w-full px-6 md:px-0">
          {audiences.map((item, i) => (
            <div
              key={i}
              className="shrink-0 w-full md:w-[35vw] flex flex-col gap-5 md:gap-6 group"
            >
              {/* Image Wrapper */}
              <div 
                className={`audience-card audience-card-clip-${i} relative w-full h-[55vh] md:h-[50vh] p-px bg-white/10 transform-gpu will-change-transform`}
              >
                <div 
                  className={`audience-card-clip-${i} relative w-full h-full overflow-hidden bg-[#12110E] transform-gpu`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 35vw"
                    unoptimized
                    className="object-cover scale-[1.2] will-change-transform transform-gpu"
                  />
                </div>
              </div>
              {/* Title below image */}
              <div className="text-center w-full">
                <span className="text-white text-[4.3vw] md:text-[1.4vw] font-light font-avenir-next tracking-[0.25em] leading-[1.1]">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Clip Paths with top and bottom edge notch shapes for each card */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {audiences.map((_, i) => (
            <Fragment key={i}>
              {/* Desktop Clip Path (top/bottom notches) */}
              <clipPath id={`audience-card-clip-desktop-${i}`} clipPathUnits="objectBoundingBox">
                <path
                  id={`audience-card-path-${i}`}
                  d={getClipPathD(0.7, 0.3)}
                />
              </clipPath>
              {/* Mobile Clip Path (left/right notches) */}
              <clipPath id={`audience-card-clip-mobile-${i}`} clipPathUnits="objectBoundingBox">
                <path
                  id={`audience-card-path-mobile-${i}`}
                  d={getClipPathMobileD(0.7, 0.3)}
                />
              </clipPath>
            </Fragment>
          ))}
        </defs>
      </svg>
    </section>
  );
}
