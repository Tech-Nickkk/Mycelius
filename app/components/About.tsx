"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Mushrooms from "./Mushrooms";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    // Split the text into characters
    const split = new SplitText(textRef.current, { type: "words,chars" });
    
    // Set initial low opacity
    gsap.set(split.chars, { opacity: 0.15 });

    // Scrub animation to fill the opacity of each character
    gsap.to(split.chars, {
      opacity: 1,
      stagger: 0.015,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%", // Start animation when the section is slightly visible
        end: "center center", // Finish animation when the section is in the middle of the screen
        scrub: 1, // Smooth scrubbing
      },
    });

  }, { scope: containerRef });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen bg-[#ffffff] px-8 overflow-hidden"
    >
      <Mushrooms sectionRef={containerRef} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <p ref={textRef} className="text-3xl md:text-5xl lg:text-[3.5rem] font-ppmori text-center font-normal text-[#0f0f0f] leading-[1.15] tracking-[-0.02em]">
          Mycelius develops exclusive <span className="font-ppeditorial italic font-light">mycelium biomaterials</span> for architecture and interiors. We transform fungi and reclaimed waste into custom panels, furniture, and luminaires — combining circular systems with <span className="font-ppeditorial italic font-light">premium aesthetics</span>. Sustainable design that feels as sophisticated as the spaces it inhabits.
        </p>
      </div>
    </section>
  );
}
