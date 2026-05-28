"use client";

import SectionShader from "./SectionShader";

export default function BlackSection() {
  return (
    <section id="black-section" className="relative w-full h-screen bg-[#0f0f0f] text-white overflow-hidden flex items-center justify-center">
      {/* 
        The shader draws an opaque white layer that dissolves to transparent 
        as the section scrolls into view, revealing this black section seamlessly. 
      */}
      <SectionShader color="#ffffff" scrollTarget="#black-section" speed={1} />
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-8 text-center opacity-90">
        <h2 className="text-6xl font-ppeditorial font-normal">
          Other
        </h2>
      </div>
    </section>
  );
}
