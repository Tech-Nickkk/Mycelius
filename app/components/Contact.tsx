"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionShader from "./SectionShader";
import ButtonShader, { useHoverInteraction } from "./ButtonShader";
import Link from "next/link";

const textFillStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #12110E 50%, rgba(18, 17, 14, 0.15) 50%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const { isHovered: isButtonHovered, handlers: buttonHandlers } = useHoverInteraction();

  // GSAP Text Reveal Animation
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current || !headingRef.current) return;

      const fillLines = headingRef.current.querySelectorAll(".fill-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 45%",
          end: "bottom 95%",
          scrub: 1,
        },
      });

      // Staggered text fill reveal on scroll (bottom to top, reversed stagger)
      tl.to(fillLines, {
        backgroundPosition: "0% 100%",
        stagger: {
          each: 0.15,
          from: "end",
        },
        ease: "power2.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex flex-col items-center justify-center min-h-screen bg-[#ffffff] text-[#12110E] overflow-hidden pt-24 pb-44 md:pb-60 px-6 md:px-12"
    >
      <SectionShader color="#12110E" scrollTarget="#contact" speed={1.13} />
      <SectionShader color="#12110E" scrollTarget="#contact" speed={1.13} playLate={true} invert={true} spread={0.3} />
      
      <div className="relative z-2 max-w-4xl mx-auto flex flex-col items-center text-center gap-6 md:gap-10 -translate-y-8 md:translate-y-0">
        {/* Heading */}
        <div ref={headingRef}>
          <h2 className="text-[6.5vw] xs:text-[6vw] sm:text-[5.5vw] md:text-[4.5vw] lg:text-[3.5vw] font-normal leading-[1.2] tracking-tight font-ppeditorial text-[#12110E]">
            <span
              className="fill-line block will-change-[background-position] pb-1"
              style={textFillStyle}
            >
              Have a space, product,
            </span>
            <span
              className="fill-line block will-change-[background-position] pb-1"
              style={textFillStyle}
            >
              or impossible idea in mind?
            </span>
          </h2>
        </div>

        {/* Action Button */}
        <Link
          href="/collab"
          {...buttonHandlers}
          className="group relative px-8 py-4 rounded-full bg-[#12110E] text-white font-sans text-sm md:text-base font-medium tracking-wide flex items-center gap-3 overflow-hidden select-none transition-all duration-300 shadow-md"
        >
          <ButtonShader isHovered={isButtonHovered} />
          <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-black">Collaborate with us</span>
          <span className="relative z-10 transition-all duration-700 group-hover:duration-200 group-hover:translate-x-1.5 group-hover:text-black">
            &rarr;
          </span>
        </Link>
      </div>

      {/* Footer Info inside the black shader transition area */}
      <div className="absolute bottom-0 left-0 w-full pt-4 pb-4 px-6 md:p-10 z-20 text-white font-suisse select-text">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">
          
          {/* Main Footer Info Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-8 w-full text-center">
            
            {/* Phone & Location */}
            <div className="flex flex-wrap md:flex-col justify-center gap-x-4 md:gap-x-0 gap-y-1 w-full md:w-auto text-center">
              <span className="text-xs md:text-sm font-light text-white/90">
                +91 9354097886
              </span>
              <span className="text-xs md:text-sm font-light text-white/50">
                Delhi NCR, India
              </span>
            </div>

            {/* Email & Web */}
            <div className="flex flex-wrap md:flex-col justify-center gap-x-4 md:gap-x-0 gap-y-1 w-full md:w-auto text-center">
              <a href="mailto:bioshift@myceliuslab.com" className="text-xs md:text-sm font-light text-white/90 hover:text-[#FF6118] transition-colors duration-300">
                bioshift@myceliuslab.com
              </a>
              <a href="https://www.myceliuslab.com" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm font-light text-white/90 hover:text-[#FF6118] transition-colors duration-300">
                www.myceliuslab.com
              </a>
            </div>

          </div>

          {/* Legal Info Row */}
          <div className="flex justify-between items-center border-t border-white/10 pt-4 pb-4 md:pb-0 text-[10px] md:text-xs font-light text-white/40">
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms & Conditions
            </Link>
            {/* Social Icons */}
            <div className="flex gap-4 items-center justify-center">
              <a
                href="https://www.instagram.com/mycelius.lab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-[#FF6118] transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/mycelius/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-[#FF6118] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
