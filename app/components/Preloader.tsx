"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";

declare global {
  interface Window {
    __hasPlayedPreloader?: boolean;
  }
}

export default function Preloader() {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Safe state initialization checking if preloader has already run in the current session
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window !== "undefined") {
      return !window.__hasPlayedPreloader;
    }
    return true;
  });

  useGSAP(() => {
    if ((typeof window !== "undefined" && window.__hasPlayedPreloader) || pathname?.startsWith('/studio')) {
      if (typeof window !== "undefined") {
         window.__hasPlayedPreloader = true;
      }
      setShouldRender(false);
      return;
    }

    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    const heroElements = document.querySelectorAll(".hero-header h1, .hero-header p");
    if (heroElements.length > 0) {
      new SplitText(".hero-header h1, .hero-header p", {
        type: "lines",
        linesClass: "line-item",
        mask: "lines",
        autoSplit: true,
      });
      gsap.set(".line-item", { y: "125%" });
    }

    // --- GSAP PRELOADER + REVEAL TIMELINE ---
    const tl = gsap.timeline({
      delay: 0.2,
      defaults: { ease: "hop" },
      onComplete: () => {
        gsap.set(".loader", { display: "none" });
        if (typeof window !== "undefined") {
          window.__hasPlayedPreloader = true;
        }
        setShouldRender(false);
      },
    });

    // 1. Word logo reveal
    tl.to(".loader .word h1", { y: "0%", duration: 1 });

    tl.to(".loader .divider", {
      scaleY: "100%",
      duration: 1,
      onStart: () => gsap.to(".loader .divider", { opacity: 0, duration: 1, delay: 0.7 }),
    });

    // Animate words apart horizontally as the line comes in
    tl.to("#word-1", { x: "-15px", duration: 1 }, "<");
    tl.to("#word-2", { x: "15px", duration: 1 }, "<");

    tl.to("#word-1 h1", { y: "105%", duration: 1, delay: 0.3 });
    tl.to("#word-2 h1", { y: "-105%", duration: 1 }, "<");

    // 3. Dual blocks overlay reveal
    tl.to(".loader .block", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      stagger: 0.1,
    });

    // 4. Hero text slide in (if on page with .hero-header)
    if (heroElements.length > 0) {
      tl.to(
        ".hero-header .line-item",
        {
          y: "0%",
          duration: 1.25,
          stagger: 0.1,
          ease: "power3.out",
        },
        "<0.2"
      );
    }
  }, { dependencies: [] }); // Empty array ensures this only runs once on mount, omitting scope allows global query

  if (typeof window !== "undefined" && window.__hasPlayedPreloader) {
    return null;
  }

  if (!shouldRender) {
    return null;
  }

  return (
    <div ref={preloaderRef} className="loader fixed inset-0 w-screen h-svh overflow-hidden z-9999 pointer-events-none">
      {/* Dark overlay blocks */}
      <div className="overlay absolute top-0 w-full h-full">
        <div className="block absolute left-0 top-0 w-[50.5%] h-full bg-[#1a1a1a] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" style={{ willChange: "clip-path" }}></div>
        <div className="block absolute right-0 top-0 w-[50.5%] h-full bg-[#1a1a1a] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" style={{ willChange: "clip-path" }}></div>
      </div>

      {/* Intro logo words */}
      <div className="intro-logo absolute inset-0 font-neue-haas font-light z-102 pointer-events-none">
        <div className="word absolute right-1/2 top-1/2 -translate-y-1/2 [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" id="word-1">
          <h1 className="text-[2.5rem] tracking-wider max-[900px]:text-[2rem] text-white leading-none translate-y-[-120%] whitespace-nowrap">
            myceli
          </h1>
        </div>
        <div className="word absolute left-1/2 top-1/2 -translate-y-1/2 [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" id="word-2">
          <h1 className="text-[2.5rem] tracking-wider max-[900px]:text-[2rem] text-orange-500 leading-none translate-y-[120%] whitespace-nowrap">
            us<span className="text-white">.</span>
          </h1>
        </div>
      </div>

      {/* Divider line */}
      <div className="divider absolute top-0 left-1/2 -translate-x-1/2 scale-y-0 origin-top w-px h-full bg-white/40 z-101"></div>
    </div>
  );
}
