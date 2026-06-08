"use client";

import { useRef } from "react";
import Image from "next/image";
import Lenis from "lenis";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
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
}

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverBgRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    if (!hoverBgRef.current || !containerRef.current) return;

    const width = target.offsetWidth;
    const left = target.offsetLeft;
    const height = target.offsetHeight - 12; // 6px padding top/bottom
    const top = 6; // vertically centered in h-12 (48px)

    const links = containerRef.current.querySelectorAll("a");
    gsap.to(links, { color: "#000000", duration: 0.15, overwrite: "auto" });
    gsap.to(target, { color: "#ffffff", duration: 0.15, overwrite: "auto" });

    gsap.to(hoverBgRef.current, {
      left: left,
      width: width,
      height: height,
      top: top,
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!hoverBgRef.current || !containerRef.current) return;

    const links = containerRef.current.querySelectorAll("a");
    gsap.to(links, { color: "#000000", duration: 0.15, overwrite: "auto" });

    gsap.to(hoverBgRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <nav className="contents">
      {/* Logo */}
      <div className="fixed top-6 left-8 z-50 mix-blend-difference flex items-center h-12 md:h-14">
        <a href="#home" onClick={(e) => scrollToSection(e, "#home")} className="block">
          <Image
            src="/mycelius-logo.png"
            alt="MYCELIUS"
            width={180}
            height={60}
            className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
            priority
          />
        </a>
      </div>

      {/* Centered Nav Links */}
      <div
        ref={containerRef}
        onMouseLeave={handleMouseLeave}
        className="fixed top-6 left-1/2 -translate-x-1/2 font-suisse text-black bg-white px-6 h-12 rounded-full flex items-stretch max-[900px]:hidden z-50"
      >
        {/* Sliding Hover Background Pill */}
        <div
          ref={hoverBgRef}
          className="absolute bg-black rounded-full pointer-events-none opacity-0 scale-90 z-0"
          style={{ willChange: "left, width, height, top" }}
        />

        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => scrollToSection(e, link.href)}
            onMouseEnter={handleMouseEnter}
            className="group relative uppercase tracking-[0.07em] text-xs font-medium flex items-center px-4 transition-colors z-10 text-black select-none"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right Side Action */}
      <div className="fixed top-6 right-8 z-50 mix-blend-difference flex items-center h-12 md:h-14">
        <a
          href="#contact"
          onClick={(e) => scrollToSection(e, "#contact")}
          className="group relative overflow-hidden font-suisse text-xs uppercase tracking-wider px-6 py-3 border border-white text-white rounded-full transition-colors duration-300 flex items-center justify-center"
        >
          <span className="relative z-10 group-hover:text-black transition-colors duration-300">
            Collab
          </span>
          {/* Expanding circle background */}
          <div className="absolute left-1/2 bottom-0 w-[300px] h-[300px] -translate-x-1/2 translate-y-1/2 scale-0 group-hover:scale-50 rounded-full bg-white transition-transform duration-500 ease-in-out z-0"></div>
        </a>
      </div>
    </nav>
  );
}
