"use client";

import SectionShader from "./SectionShader";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative flex items-center justify-center min-h-screen bg-[#ffffff] text-[#12110E] overflow-hidden"
    >
      <SectionShader color="#12110E" scrollTarget="#contact" speed={1.13} />
      
      <div className="relative z-10 text-center">
        <h2 className="text-6xl font-ppeditorial font-normal text-[#12110E]">
          Contact
        </h2>
      </div>
    </section>
  );
}
