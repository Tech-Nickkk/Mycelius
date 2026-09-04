"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import ButtonShader, { useHoverInteraction } from "./ButtonShader";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const getLenis = (): Lenis | undefined => {
  if (typeof window !== "undefined") {
    return (window as unknown as { lenis?: Lenis }).lenis;
  }
  return undefined;
};

// Navigation links configuration
const MENU_LINKS = [
  { label: "Home", targetId: "#home" },
  { label: "About", targetId: "#about" },
  { label: "What We Do", targetId: "#what-we-do" },
  { label: "Who we Grow for", targetId: "#target-audience-scroll" },
  { label: "Who's Watching Us Grow", targetId: "#incubators" },
  { label: "Limited Editions", targetId: "/limited-editions" },
  { label: "Contact", targetId: "#contact" },
];

interface MenuLinkItemProps {
  link: { label: string; targetId: string };
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

function MenuLinkItem({ link, onClick }: MenuLinkItemProps) {
  return (
    <div className="group relative pointer-events-auto select-none w-fit flex items-center">
      {/* Glowing Brand Orange Bullet Dot indicator */}
      <span className="w-2 h-2 rounded-full bg-[#F15B20] shadow-[0_0_12px_#F15B20] scale-0 group-hover:scale-100 transition-all duration-300 ease-out mr-3 -ml-5 opacity-0 group-hover:opacity-100 shrink-0" />

      {/* Kinetic Roll-Up Text Wrapper */}
      <div className="menu-link overflow-hidden relative z-10">
        <Link
          href={link.targetId.startsWith("/") ? link.targetId : "/"}
          onClick={(e) => onClick(e, link.targetId)}
          className="menu-anim-line relative block text-[1.8rem] xs:text-[2.2rem] md:text-[2.5rem] lg:text-[2.85rem] font-extralight font-kodchasan leading-tight pb-0.5 translate-y-[-110%] will-change-transform capitalize tracking-tight"
        >
          {/* White text (slides up and out on hover) */}
          <span className="block text-white transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-hover:opacity-0">
            {link.label}
          </span>
          {/* Brand Orange text (rolls up from below on hover only) */}
          <span className="absolute inset-0 block text-[#F15B20] opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0">
            {link.label}
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isHovered: isLimitedHovered, handlers: limitedHandlers } = useHoverInteraction();
  const { isHovered: isCollabHovered, handlers: collabHandlers } = useHoverInteraction();
  const { isHovered: isMenuHovered, handlers: menuHandlers } = useHoverInteraction();
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scrolling to section stored in sessionStorage after page load/navigation
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined") {
      const target = sessionStorage.getItem("scrollToSection");
      if (target) {
        sessionStorage.removeItem("scrollToSection");
        // Delay scroll slightly to allow layout/animations to settle
        setTimeout(() => {
          const lenis = getLenis();
          if (lenis) {
            const targetPos = (target === "/" || target === "#home") ? 0 : target;
            lenis.scrollTo(targetPos, {
              duration: 1.5,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else {
            const element = (target === "/" || target === "#home") ? document.body : document.querySelector(target);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
        }, 200);
      }
    }
  }, [pathname]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Initialize GSAP plugins
  useGSAP(() => {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", ".87, 0, .13, 1");
  }, { scope: containerRef });

  const openMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Stop smooth scroll
    const lenis = getLenis();
    if (lenis) lenis.stop();

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsOpen(true);
      },
    });

    const mainContainer = document.querySelector(".main-content-container");
    const menuToggleLabel = containerRef.current?.querySelector(".menu-toggle-label-text");
    const menuOverlay = containerRef.current?.querySelector(".menu-overlay");
    const menuOverlayContent = containerRef.current?.querySelector(".menu-overlay-content");
    const menuMediaWrapper = containerRef.current?.querySelector(".menu-media-wrapper");
    const collabBtn = containerRef.current?.querySelector(".menu-collab-btn");
    const columns = containerRef.current?.querySelectorAll(".menu-col") || [];

    if (!mainContainer || !menuToggleLabel || !menuOverlay || !menuOverlayContent || !menuMediaWrapper || !collabBtn) {
      isAnimating.current = false;
      return;
    }

    // Set will-change dynamically to optimize rendering during push animation
    gsap.set(mainContainer, { willChange: "transform" });

    // Reset columns opacity in case of previous close animation state
    gsap.set(columns, { opacity: 1 });

    tl.to(menuToggleLabel, { y: "-110%", duration: 1.4, ease: "hop" })
      .to(collabBtn, { opacity: 0, scale: 0.8, pointerEvents: "none", duration: 1.2, ease: "hop" }, "<")
      .to(mainContainer, { y: "100svh", duration: 1.4, ease: "hop" }, "<")
      .to(menuOverlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.4, ease: "hop" }, "<")
      .to(menuOverlayContent, { yPercent: 0, duration: 1.4, ease: "hop" }, "<")
      .to(menuMediaWrapper, { opacity: 1, duration: 1.0, ease: "power2.out", delay: 0.7 }, "<");

    // Add a label to start all text animations together with the overlay opening
    tl.add("textAnimate", "-=1.45");

    columns.forEach((col) => {
      const animLines = col.querySelectorAll(".menu-anim-line");
      if (animLines.length > 0) {
        tl.to(
          animLines,
          {
            y: "0%",
            duration: 2.2,
            ease: "hop",
            stagger: -0.075,
          },
          "textAnimate"
        );
      }
    });
  };

  const closeMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        // Restart smooth scroll
        const lenis = getLenis();
        if (lenis) lenis.start();

        // Clear inline transforms from mainContainer to restore viewport-relative fixed positioning
        const mainContainer = document.querySelector(".main-content-container");
        if (mainContainer) {
          gsap.set(mainContainer, { clearProps: "transform,willChange" });
        }

        // Reset variables and state
        if (containerRef.current) {
          const columns = containerRef.current.querySelectorAll(".menu-col");
          const menuMediaWrapper = containerRef.current.querySelector(".menu-media-wrapper");
          const collabBtn = containerRef.current.querySelector(".menu-collab-btn");
          
          columns.forEach((col) => {
            const animLines = col.querySelectorAll(".menu-anim-line");
            gsap.set(animLines, { y: "-110%" });
          });
          
          if (columns.length > 0) gsap.set(columns, { opacity: 1 });
          if (menuMediaWrapper) gsap.set(menuMediaWrapper, { opacity: 0 });
          if (collabBtn) gsap.set(collabBtn, { opacity: 1, scale: 1, clearProps: "pointerEvents" });
        }

        isAnimating.current = false;
        setIsOpen(false);
      },
    });

    const mainContainer = document.querySelector(".main-content-container");
    const menuToggleLabel = containerRef.current?.querySelector(".menu-toggle-label-text");
    const menuOverlay = containerRef.current?.querySelector(".menu-overlay");
    const menuOverlayContent = containerRef.current?.querySelector(".menu-overlay-content");
    const collabBtn = containerRef.current?.querySelector(".menu-collab-btn");
    const columns = containerRef.current?.querySelectorAll(".menu-col") || [];

    if (!mainContainer || !menuToggleLabel || !menuOverlay || !menuOverlayContent || !collabBtn) {
      isAnimating.current = false;
      return;
    }

    // Set will-change dynamically to optimize rendering during pull animation
    gsap.set(mainContainer, { willChange: "transform" });

    tl.to(mainContainer, { y: "0svh", duration: 1.4, ease: "hop" })
      .to(collabBtn, { opacity: 1, scale: 1, pointerEvents: "auto", duration: 1.4, ease: "hop" }, "<")
      .to(menuOverlay, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: 1.4, ease: "hop" }, "<")
      .to(menuOverlayContent, { yPercent: -50, duration: 1.4, ease: "hop" }, "<")
      .to(menuToggleLabel, { y: "0%", duration: 1.4, ease: "hop" }, "<")
      .to(columns, { opacity: 0.25, duration: 1.4, ease: "hop" }, "<");
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isAnimating.current) return;

    if (targetId.startsWith("/")) {
      if (isOpen) closeMenu();
      if (pathname !== targetId) {
        router.push(targetId);
      }
      return;
    }

    if (pathname !== "/") {
      e.preventDefault();
      sessionStorage.setItem("scrollToSection", targetId);
      if (isOpen) closeMenu();
      router.push("/");
      return;
    }

    e.preventDefault();

    const doScroll = () => {
      if (typeof window !== "undefined") {
        const lenis = getLenis();
        if (lenis) {
          const target = (targetId === "/" || targetId === "#home") ? 0 : targetId;
          lenis.scrollTo(target, {
            duration: 1.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
          return;
        }
      }
      const targetElement = (targetId === "/" || targetId === "#home") ? document.body : document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (isOpen) {
      closeMenu();
      setTimeout(doScroll, 1400);
    } else {
      doScroll();
    }
  };

  return (
    <div ref={containerRef}>
      {/* Fixed Menu Bar (Always visible) */}
      <header className={`fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none ${isScrolled ? "mix-blend-difference" : ""}`}>
        
        {/* Logo */}
        <div className="pointer-events-auto flex items-center h-12 md:h-14">
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="block"
            aria-label="Mycelius Home"
          >
            <Image
              src="/mycelius-logo.png"
              alt="MYCELIUS"
              width={180}
              height={60}
              className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>
        </div>

        {/* Centered Limited Edition & Collab Buttons */}
        <nav aria-label="Quick Actions" className="menu-collab-btn pointer-events-auto flex items-center justify-center gap-2 md:gap-3 will-change-[opacity,transform] h-12 md:h-14">
          <Link
            href="/limited-editions"
            onClick={() => {
              if (isOpen) closeMenu();
            }}
            {...limitedHandlers}
            className="hidden min-[350px]:flex group relative overflow-hidden font-sans text-[10px] md:text-xs uppercase tracking-wider px-3.5 py-2 md:px-6 md:py-2.5 border border-white text-white rounded-full transition-all duration-300 items-center justify-center whitespace-nowrap"
          >
            <ButtonShader isHovered={isLimitedHovered} colorA="#12110E" colorB="#ffffff" />
            <span className={`relative z-10 transition-colors duration-700 group-hover:duration-200 font-semibold ${isLimitedHovered ? "text-black" : "text-white"}`}>
              Limited Edition
            </span>
          </Link>

          <Link
            href="/collab"
            onClick={() => {
              if (isOpen) closeMenu();
            }}
            {...collabHandlers}
            className="group relative overflow-hidden font-sans text-[10px] md:text-xs uppercase tracking-wider px-3.5 py-2 md:px-6 md:py-2.5 border border-white text-white rounded-full transition-all duration-300 flex items-center justify-center whitespace-nowrap"
          >
            <ButtonShader isHovered={isCollabHovered} colorA="#12110E" colorB="#ffffff" />
            <span className={`relative z-10 transition-colors duration-700 group-hover:duration-200 font-semibold ${isCollabHovered ? "text-black" : "text-white"}`}>
              Collab
            </span>
          </Link>
        </nav>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (isOpen) {
              closeMenu();
            } else {
              openMenu();
            }
          }}
          {...menuHandlers}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close main menu" : "Open main menu"}
          className="menu-toggle-btn flex items-center gap-4 cursor-pointer select-none pointer-events-auto text-white font-sans group bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full"
        >
          <div className="menu-toggle-label hidden md:block overflow-hidden h-[1.2em]">
            <p className="menu-toggle-label-text relative translate-y-0 will-change-transform uppercase tracking-[0.07em] text-xs font-semibold">
              {isOpen ? "Close" : "Menu"}
            </p>
          </div>

          {/* Circle Hamburger Icon */}
          <div className="menu-hamburger-icon w-12 h-12 flex flex-col justify-center items-center border border-white/20 rounded-full relative overflow-hidden transition-colors duration-300 group-hover:border-white">
            <ButtonShader isHovered={isMenuHovered} colorA="#12110E" colorB="#ffffff" />
            <span
              className={`absolute w-3.75 h-[1.25px] transition-all duration-750 ease-[cubic-bezier(0.87,0,0.13,1)] origin-center will-change-transform z-10 ${
                isMenuHovered ? "bg-black" : "bg-white"
              } ${
                isOpen ? "translate-y-0 rotate-45 scale-x-105" : "-translate-y-0.75"
              }`}
            />
            <span
              className={`absolute w-3.75 h-[1.25px] transition-all duration-750 ease-[cubic-bezier(0.87,0,0.13,1)] origin-center will-change-transform z-10 ${
                isMenuHovered ? "bg-black" : "bg-white"
              } ${
                isOpen ? "translate-y-0 -rotate-45 scale-x-105" : "translate-y-0.75"
              }`}
            />
          </div>
        </button>

      </header>

      {/* Menu Overlay Panel */}
      <div className="menu-overlay fixed top-0 left-0 w-screen h-screen text-white bg-[#12110E] overflow-hidden z-40 [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)] will-change-[clip-path]">
        <div className="menu-overlay-content fixed top-0 left-0 w-screen h-screen text-white flex -translate-y-1/2 will-change-transform pointer-events-auto">
          
          {/* Media Section (Hidden on mobile) */}
          <div className="menu-media-wrapper flex-2 opacity-0 will-change-opacity max-[1000px]:hidden h-full relative">
            <Image
              src="/Menu_Image.png"
              alt="Menu media"
              fill
              priority
              className="object-cover opacity-25"
            />
          </div>

          {/* Content Links and Footer */}
          <div className="menu-content-wrapper flex-3 max-[1000px]:flex-1 flex flex-col justify-between h-full pt-16 md:pt-20 pb-8 md:pb-12 px-8 md:px-16 lg:px-24 overflow-y-auto scrollbar-none">
            
            {/* Main Links */}
            <div className="menu-col flex flex-col gap-1.5 md:gap-2.5 my-auto w-full">
              {MENU_LINKS.map((link) => (
                <MenuLinkItem key={link.label} link={link} onClick={handleLinkClick} />
              ))}
            </div>

             {/* Footer Row */}
            <div className="menu-footer w-full flex flex-wrap items-end justify-between gap-6 md:gap-8 mt-4 md:mt-6 border-t border-white/10 pt-3 md:pt-4">
              
              {/* Location */}
              <div className="menu-col flex flex-col gap-1 min-w-50">
                <div className="menu-footer-line overflow-hidden">
                  <p className="menu-anim-line text-[10px] uppercase tracking-widest text-[#D4D0C9] translate-y-[-110%] will-change-transform font-light font-avenir-next">
                    Location
                  </p>
                </div>
                <div className="menu-footer-line overflow-hidden">
                  <p className="menu-anim-line text-sm text-white/90 translate-y-[-110%] will-change-transform font-light font-avenir-next tracking-wider">
                    Delhi NCR, India
                  </p>
                </div>
                <div className="menu-footer-line overflow-hidden">
                  <p className="menu-anim-line text-sm text-white/90 translate-y-[-110%] will-change-transform font-light font-avenir-next tracking-wider">
                    +91 9354097886
                  </p>
                </div>
              </div>

              {/* Contact details */}
              <div className="menu-col flex flex-col gap-1 min-w-50">
                <div className="menu-footer-line overflow-hidden">
                  <p className="menu-anim-line text-[10px] uppercase tracking-widest text-[#D4D0C9] translate-y-[-110%] will-change-transform font-light font-avenir-next">
                    Contact
                  </p>
                </div>
                <div className="menu-footer-line overflow-hidden">
                  <a href="mailto:bioshift@myceliuslab.com" className="menu-anim-line block text-sm text-white/90 hover:text-[#F15B20] transition-colors duration-300 translate-y-[-110%] will-change-transform font-light font-avenir-next tracking-wider">
                    bioshift@myceliuslab.com
                  </a>
                </div>
                <div className="menu-footer-line overflow-hidden">
                  <a href="https://www.myceliuslab.com" target="_blank" rel="noopener noreferrer" className="menu-anim-line block text-sm text-white/90 hover:text-[#F15B20] transition-colors duration-300 translate-y-[-110%] will-change-transform font-light font-avenir-next tracking-wider">
                    www.myceliuslab.com
                  </a>
                </div>
              </div>

              {/* Legal */}
              <div className="menu-col flex flex-col gap-1 min-w-35">
                <div className="menu-footer-line overflow-hidden">
                  <p className="menu-anim-line text-[10px] uppercase tracking-widest text-[#D4D0C9] translate-y-[-110%] will-change-transform font-light font-avenir-next">
                    Legal
                  </p>
                </div>
                <div className="menu-footer-line overflow-hidden">
                  <a
                    href="/docx/Mycelius_Terms_and_Conditions.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-anim-line block text-sm text-white/90 hover:text-[#F15B20] transition-colors duration-300 translate-y-[-110%] will-change-transform font-light font-avenir-next tracking-wider"
                  >
                    Terms & Conditions
                  </a>
                </div>
                <div className="menu-footer-line overflow-hidden">
                  <a
                    href="/docx/Mycelius_Privacy_Policy.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-anim-line block text-sm text-white/90 hover:text-[#F15B20] transition-colors duration-300 translate-y-[-110%] will-change-transform font-light font-avenir-next tracking-wider"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>

              {/* Socials */}
              <div className="menu-col flex flex-col gap-1 min-w-30">
                <div className="menu-footer-line overflow-hidden">
                  <p className="menu-anim-line text-[10px] uppercase tracking-widest text-[#D4D0C9] translate-y-[-110%] will-change-transform font-light font-avenir-next">
                    Follow
                  </p>
                </div>
                <div className="menu-footer-line overflow-hidden flex gap-4 mt-1">
                  <div className="menu-anim-line flex gap-4 translate-y-[-110%] will-change-transform">
                    <a
                      href="https://www.instagram.com/mycelius.lab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#F15B20] transition-colors duration-300"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/mycelius/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#F15B20] transition-colors duration-300"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
