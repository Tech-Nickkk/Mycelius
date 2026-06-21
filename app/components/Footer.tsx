"use client";

import { useRef } from "react";
import SectionShader from "./SectionShader";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="footer"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#12110E] overflow-hidden flex items-center justify-center"
    >
      {/* TargetAudience-style Section Shader (scrollTarget points to #footer, color is white/transparent transition) */}
      <SectionShader
        color="#ffffff"
        scrollTarget="#footer"
        speed={1.13}
      />

      {/* Footer Text in the Center */}
      <div className="relative z-10 text-center select-none">
        <h2 className="text-white text-[10vw] md:text-[6vw] font-normal tracking-tight font-suisse leading-none uppercase">
          Footer
        </h2>
      </div>
    </section>
  );
}
