"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    // Split hero text into animation layers using 'new' instance for better memory management
    new SplitText(".hero-header h1, .hero-header p", {
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
    tl.to(".loader .word h1", { y: "0%", duration: 1 });

    tl.to(".loader .divider", {
      scaleY: "100%",
      duration: 1,
      onComplete: () => gsap.to(".loader .divider", { opacity: 0, duration: 0.4, delay: 0.3 }),
    });

    // Animate words apart horizontally as the line comes in
    tl.to("#word-1", { x: "-20px", duration: 1 }, "<");
    tl.to("#word-2", { x: "20px", duration: 1 }, "<");

    tl.to("#word-1 h1", { y: "105%", duration: 1, delay: 0.3 });
    tl.to("#word-2 h1", { y: "-105%", duration: 1 }, "<");

    // 3. Dual blocks overlay reveal + hero video zoom
    tl.to(".loader .block", {
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
  }, { dependencies: [] }); // Empty array ensures this only runs once on mount, omitting scope allows global query

  return (
    <div ref={preloaderRef} className="loader fixed inset-0 w-screen h-svh overflow-hidden z-100 pointer-events-none">
      {/* Dark overlay blocks */}
      <div className="overlay absolute top-0 w-full h-full flex">
        <div className="block w-full h-full bg-[#1a1a1a] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" style={{ willChange: "clip-path" }}></div>
        <div className="block w-full h-full bg-[#1a1a1a] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" style={{ willChange: "clip-path" }}></div>
      </div>

      {/* Intro logo words */}
      <div className="intro-logo absolute top-1/2 left-1/2 translate-x-[-75%] -translate-y-1/2 flex font-ppeditorial font-medium z-102">
        <div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] relative" id="word-1">
          <h1 className="text-[2.5rem] max-[900px]:text-[2rem] text-white font-medium leading-none translate-y-[-120%]">
            Myceli
          </h1>
        </div>
        <div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" id="word-2">
          <h1 className="text-[2.5rem] max-[900px]:text-[2rem] text-orange-500 leading-none translate-y-[120%]">
            us
          </h1>
        </div>
      </div>

      {/* Divider line */}
      <div className="divider absolute top-0 left-1/2 -translate-x-1/2 scale-y-0 origin-top w-px h-full bg-white/20 z-101"></div>
    </div>
  );
}
