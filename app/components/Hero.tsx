"use client";

import HeroShader from "./HeroShader";

export default function Hero() {
  return (
    <section id="home" className="hero relative w-full h-screen overflow-visible">
      {/* Background Video */}
      <div id="hero-video-wrapper" className="hero-img absolute inset-0 w-full h-[120vh] overflow-hidden origin-center will-change-transform scale-150 z-[1]">
        <video
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* WebGL scroll shader */}
      <HeroShader color="#ffffff" spread={0.5} speed={1.0} scrollTarget="#hero-video-wrapper" />

      {/* Hero Text Overlay */}
      <div className="hero-content absolute inset-0 w-full h-svh px-8 flex flex-col items-center justify-center text-center z-10">
        <div className="hero-header w-full max-w-4xl flex flex-col items-center justify-center text-center">
          <h1 className="text-white text-[11svh] max-sm:text-4xl font-ppmori leading-[1.1]  mb-4 text-center">
            Not manufactured.<br />
            <span className="font-ppeditorial italic font-light">Cultivated.</span>
          </h1>
          <p className="text-white max-w-xl text-xs md:text-sm font-ppmori tracking-wide font-light text-center">
            Premium mycelium biomaterials designed for interior spaces where
            sustainability, functionality, and material culture coexist
            beautifully.
          </p>
        </div>
      </div>
    </section>
  );
}
