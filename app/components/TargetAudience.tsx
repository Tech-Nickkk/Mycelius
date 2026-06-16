"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionShader from "./SectionShader";
import Image from "next/image";

const AUDIENCES = [
  {
    title: "Interior Designers",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Architects",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Luxury Residences",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Hospitality Spaces",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Sustainable Commercial",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
  },
];

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

export default function TargetAudience() {
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

      // Text fill animation (plays as the section enters the viewport, before pinning)
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

      // Slide heading off to the left as user scrolls (previous animation kept exactly as is)
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

      // "we" and "with" lines move faster (previous animation kept exactly as is)
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

      // Parallax each card image (subtle shift)
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
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="target-audience-scroll"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#12110E] overflow-hidden"
    >
      <SectionShader
        color="#ffffff"
        scrollTarget="#target-audience-scroll"
        speed={1.13}
      />

      {/* Left-side heading — slides out as you scroll */}
      <div
        ref={(el) => {
          headingRef.current = el;
          weWithRef.current = el;
        }}
        className="absolute left-16 md:left-24 top-1/2 -translate-y-1/2 z-20 pointer-events-none will-change-transform"
      >
        <h2 className="text-[14vw] md:text-[8vw] font-normal tracking-tight leading-[1.05]">
          <span
            className="fill-line block text-left will-change-[background-position]"
            style={textFillStyle}
          >
            Who
          </span>
          <span
            className="fill-line fast-line block pl-[18vw] md:pl-[12vw] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            we
          </span>
          <span
            className="fill-line block text-left will-change-[background-position]"
            style={textFillStyle}
          >
            work
          </span>
          <span
            className="fill-line fast-line block pl-[13vw] md:pl-[8.5vw] will-change-[background-position,transform]"
            style={textFillStyle}
          >
            with
          </span>
        </h2>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="absolute top-0 left-0 h-full flex items-center will-change-transform"
        style={{ paddingLeft: "42vw", paddingRight: "4vw" }}
      >
        {/* Cards row */}
        <div className="flex items-center gap-6 md:gap-8 h-full py-12">
          {AUDIENCES.map((item, i) => (
            <div
              key={i}
              className="audience-card relative shrink-0 w-[65vw] md:w-[35vw] h-[55vh] md:h-[60vh] overflow-hidden group"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 65vw, 35vw"
                className="object-cover scale-[1.2] will-change-transform"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-10" />
              {/* Title on top of image */}
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <span className="text-white text-[3.5vw] md:text-[1.6vw] font-normal tracking-tight leading-[1.1] font-ppeditorial">
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
