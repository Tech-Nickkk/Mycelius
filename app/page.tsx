"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import BlackSection from "./components/BlackSection";
import Contact from "./components/Contact";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    // Split hero text into animation layers
    SplitText.create(".hero-header h1, .hero-header p", {
      type: "lines",
      linesClass: "line-item",
      mask: "lines",
      autoSplit: true,
    });

    gsap.set(".line-item", { y: "125%" });

    // --- GSAP PRELOADER + REVEAL TIMELINE ---
    const tl = gsap.timeline({
      delay: 0.3,
      defaults: { ease: "hop" },
    });

    // 1. Word logo reveal
    tl.to(".word h1", { y: "0%", duration: 1 });

    tl.to(".divider", {
      scaleY: "100%",
      duration: 1,
      onComplete: () => gsap.to(".divider", { opacity: 0, duration: 0.4, delay: 0.3 }),
    });

    // Animate words apart horizontally as the line comes in
    tl.to("#word-1", { x: "-20px", duration: 1 }, "<");
    tl.to("#word-2", { x: "20px", duration: 1 }, "<");

    tl.to("#word-1 h1", { y: "105%", duration: 1, delay: 0.3 });
    tl.to("#word-2 h1", { y: "-105%", duration: 1 }, "<");

    // 3. Dual blocks overlay reveal + hero video zoom
    tl.to(".block", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
      onStart: () => gsap.to(".hero-img", { scale: 1, duration: 2, ease: "hop" }),
    });

    // 4. Hero text slide in
    tl.to(".hero-header .line-item", {
      y: "0%",
      duration: 1.25,
      stagger: 0.1,
      ease: "power3.out",
      onComplete: () => {
        // Remove preloader from rendering entirely
        gsap.set(".loader", { display: "none" });
      },
    }, "<0.2");
  }, { scope: containerRef });

  return (
    <>
      <Navbar />
      <div
        ref={containerRef}
        className="relative bg-[#ffffff] text-[#0f0f0f] overflow-x-hidden selection:bg-[#FF6118]/20 selection:text-[#FF6118]"
      >
        <Preloader />
        <Hero />
        <About />
        <BlackSection />
        <Contact />
      </div>
    </>
  );
}