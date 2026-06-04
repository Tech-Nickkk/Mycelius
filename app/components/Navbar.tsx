"use client";

import Image from "next/image";
import Lenis from "lenis";

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
  return (
    <nav className="fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-99 mix-blend-difference">
      {/* Logo */}
      <div className="flex justify-center items-center">
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
      <div className="font-ppmori text-white flex gap-16 justify-center items-center max-[900px]:hidden">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => scrollToSection(e, link.href)}
            className="group relative uppercase tracking-[0.07em] text-xs pb-1"
          >
            {link.label}
            <span className="absolute left-0 bottom-0 w-full h-px bg-white scale-x-0 origin-right transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:origin-left"></span>
          </a>
        ))}
      </div>

      {/* Right Side Action */}
      <div className="flex justify-end items-center">
        <a
          href="#contact"
          onClick={(e) => scrollToSection(e, "#contact")}
          className="group relative overflow-hidden font-ppmori text-xs uppercase tracking-wider px-6 py-3 border border-white text-white rounded-full transition-colors duration-300 flex items-center justify-center"
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
