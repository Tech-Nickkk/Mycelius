"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitText from "gsap/SplitText";
import CustomEase from "gsap/CustomEase";
import Lenis from "lenis";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const lenisWindow = window as typeof window & { lenis?: Lenis };
      if (lenisWindow.lenis) {
        lenisWindow.lenis.scrollTo(id, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        return;
      }
    }
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Register plugins locally within the effect
    gsap.registerPlugin(CustomEase, SplitText);

    // Create cinematic easing functions
    CustomEase.create("hop", "0.9, 0, 0.1, 1");
    CustomEase.create("glide", "0.8, 0, 0.2, 1");

    const ctx = gsap.context(() => {
      const introImages = gsap.utils.toArray<HTMLElement>(".intro-img");
      const introImgScale = 0.2;
      const introImgGap = 40;
      const introImgRotations = [-15, 5, -7.5, 10, -2.5];

      const introImgScaledWidth = window.innerWidth * introImgScale;
      const introImgRowWidth = introImgScaledWidth * 5 + introImgGap * 4;
      const introImgCenteredX = (window.innerWidth - introImgRowWidth) / 2;
      const introImgOffScreenX = introImgCenteredX - window.innerWidth * 1.3;

      // Position each intro image offscreen initially
      introImages.forEach((img, i) => {
        const centeredX =
          introImgCenteredX +
          i * (introImgScaledWidth + introImgGap) +
          introImgScaledWidth / 2 -
          window.innerWidth / 2;

        const offScreenX =
          introImgOffScreenX +
          i * (introImgScaledWidth + introImgGap) +
          introImgScaledWidth / 2 -
          window.innerWidth / 2;

        gsap.set(img, {
          scale: introImgScale,
          x: offScreenX,
          rotation: introImgRotations[i],
          borderRadius: "2.5rem",
        });

        // Store target value directly on dataset for timeline computation
        img.dataset.centeredX = centeredX.toString();
      });

      // Split layout typography lines for masks
      SplitText.create("nav a, .hero-header h1, .hero-header p, .hero-social p, .hero-social a", {
        type: "lines",
        linesClass: "line-item", // Changed from 'line' to avoid conflicting with utility naming
        mask: "lines",
        autoSplit: true,
      });

      // Hide textual content below mask line
      gsap.set(".line-item", { y: "125%" });

      // Core Reveal Timeline Sequence
      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(".preloader-bar", {
        scaleX: 1,
        duration: 1.5,
        ease: "glide",
        onComplete: () => {
          gsap.set(".preloader-bar", { transformOrigin: "right" });
        },
      });

      tl.to(".preloader-bar", {
        scaleX: 0,
        duration: 1.25,
        ease: "hop",
      });

      tl.to(
        ".preloader-overlay",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        },
        "<0.75"
      );

      introImages.forEach((img) => {
        tl.to(
          img,
          {
            x: parseFloat(img.dataset.centeredX || "0"),
            duration: 1.5,
            ease: "glide",
          },
          "<0.025"
        );
      });

      tl.to(
        ".intro-img:nth-child(1), .intro-img:nth-child(2)",
        { x: "-100vw", duration: 1.5, ease: "glide" },
        "spread"
      );

      tl.to(
        ".intro-img:nth-child(4), .intro-img:nth-child(5)",
        { x: "100vw", duration: 1.5, ease: "glide" },
        "spread"
      );

      tl.to(
        ".hero-img",
        {
          scale: 1,
          x: 0,
          rotation: 0,
          borderRadius: 0,
          duration: 1.5,
          ease: "glide",
        },
        "<"
      );

      tl.to(
        "nav a .line-item",
        {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        },
        "<1"
      );

      tl.to(
        ".hero-header .line-item",
        {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        },
        "<"
      );

    }, containerRef);

    return () => ctx.revert(); // Clean up animations safely on unmount
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#ffffff] text-[#0f0f0f] overflow-x-hidden selection:bg-[#FF6118]/20 selection:text-[#FF6118]">
      {/* Preloader Elements */}
      <div className="preloader-overlay fixed inset-0 w-full h-[100svh] bg-[#0f0f0f] z-50" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
        <div className="preloader-bar absolute top-0 left-0 w-full h-[3px] bg-[#ffffff] origin-left scale-x-0 will-change-transform" />
      </div>

      {/* Navigation Layer */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-20">
        <div className="nav-logo flex items-center">
          <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className="block">
            <img src="/logo.avif" alt="MYCELIUS" className="h-15 w-auto object-contain" />
          </a>
        </div>
        <div className="nav-items font-display text-[#0f0f0f] flex gap-16 max-[1000px]:flex-col max-[1000px]:items-end max-[1000px]:gap-2">
          <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className="block font-normal uppercase tracking-[0.08em] text-[20px] transition-colors duration-300 hover:text-[#FF6118]">Home</a>
          <a href="#about" onClick={(e) => scrollToSection(e, "#about")} className="block font-normal uppercase tracking-[0.08em] text-[20px] transition-colors duration-300 hover:text-[#FF6118]">About</a>
          <a href="#other" onClick={(e) => scrollToSection(e, "#other")} className="block font-normal uppercase tracking-[0.08em] text-[20px] transition-colors duration-300 hover:text-[#FF6118]">Other</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, "#contact")} className="block font-normal uppercase tracking-[0.08em] text-[20px] transition-colors duration-300 hover:text-[#FF6118]">Contact</a>
        </div>
      </nav>

      {/* Hero Stage Section */}
      <section id="home" className="hero relative w-full h-[100svh] overflow-hidden">
        {/* Intro Layout Images */}
        <div className="intro-img absolute inset-0 w-full h-full overflow-hidden origin-center will-change-transform">
          <img src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80" alt="Industrial Design 1" className="w-full h-full object-cover" />
        </div>
        <div className="intro-img absolute inset-0 w-full h-full overflow-hidden origin-center will-change-transform">
          <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80" alt="Industrial Design 2" className="w-full h-full object-cover" />
        </div>
        <div className="intro-img hero-img absolute inset-0 w-full h-full overflow-hidden origin-center will-change-transform">
          <img src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=240,fit=crop/YD0lM7alaNcRw9GV/screenshot-2025-09-09-at-5.56.08a-pm-mk34nqKynVCkLGg0.png" alt="Industrial Design 3" className="w-full h-full object-cover" />
        </div>
        <div className="intro-img absolute inset-0 w-full h-full overflow-hidden origin-center will-change-transform">
          <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80" alt="Industrial Design 4" className="w-full h-full object-cover" />
        </div>
        <div className="intro-img absolute inset-0 w-full h-full overflow-hidden origin-center will-change-transform">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80" alt="Industrial Design 5" className="w-full h-full object-cover" />
        </div>

        {/* Textual Interface Content Overlay */}
        <div className="hero-content absolute inset-0 w-full h-[100svh] px-8 flex flex-col items-center justify-center text-center z-10">
          <div className="hero-header w-full max-w-2xl flex flex-col items-center justify-center text-center">
            <h1 className="text-[#0f0f0f] text-[10svh] max-sm:text-4xl font-display leading-[1.1] mb-6 text-center">
              Not manufactured.<br /><span className="text-[#FF6118]">Cultivated.</span>
            </h1>
            <p className="text-[#0f0f0f]/80 text-sm md:text-xl font-sans tracking-tight font-light  text-center">
              Premium mycelium biomaterials designed for interior spaces where sustainability, functionality, and material culture coexist beautifully.
            </p>
          </div>
        </div>
      </section>

      {/* Your standard sections follow natively behind the intro stage */}
      <section id="about" className="flex items-center justify-center min-h-screen bg-[#ffffff]">
        <h2 className="text-6xl font-display font-normal text-[#0f0f0f]">About</h2>
      </section>

      <section id="other" className="flex items-center justify-center min-h-screen bg-[#ffffff] border-t border-neutral-100">
        <h2 className="text-6xl font-display font-normal text-[#0f0f0f]">Other</h2>
      </section>

      <section id="contact" className="flex items-center justify-center min-h-screen bg-[#ffffff] border-t border-neutral-100">
        <h2 className="text-6xl font-display font-normal text-[#0f0f0f]">Contact</h2>
      </section>
    </div>
  );
}