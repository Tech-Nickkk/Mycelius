"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Disable smooth scroll completely inside the Sanity Studio dashboard
    if (pathname && pathname.startsWith("/studio")) return;

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as typeof window & { lenis?: Lenis }).lenis = lenis;
    }

    // Connect Lenis scroll event to GSAP ScrollTrigger updates
    lenis.on("scroll", ScrollTrigger.update);

    // Synchronize Lenis with GSAP ticker for a perfectly smooth animation loop
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(tick);
    
    // Disable lagSmoothing so ticker stays in sync with browser paint cycles
    gsap.ticker.lagSmoothing(0);

    // Handle window resize and load to keep Lenis and GSAP ScrollTrigger perfectly in sync across screen size changes
    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    // Clean up event listeners and destroy instances on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
      gsap.ticker.remove(tick);
      lenis.destroy();
      
      // Clean up any registered ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
