"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

const generatePath = (progress: number, isEntering: boolean) => {
  // A fluid wave factor that peaks at the middle of the transition
  const wave = Math.sin(progress * Math.PI) * 0.45;
  let topY, topCY, bottomY, bottomCY;

  if (isEntering) {
    topY = 0;
    topCY = 0;
    bottomY = progress;
    bottomCY = progress + wave;
  } else {
    topY = progress;
    topCY = progress + wave;
    bottomY = 1;
    bottomCY = 1;
  }

  return `M 0 ${topY} Q 0.5 ${topCY} 1 ${topY} L 1 ${bottomY} Q 0.5 ${bottomCY} 0 ${bottomY} Z`;
};

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const pendingRouteRef = useRef<string | null>(null);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(CustomEase);
    try {
      CustomEase.create("hop", ".87, 0, .13, 1");
      CustomEase.create("fluid", ".65, 0, .35, 1"); // Slightly softer for fluid
    } catch (e) {
      // CustomEase already exists
    }
  }, []);

  // When pathname changes (Route entry animation - exiting the curtain)
  useEffect(() => {
    if (!isTransitioningRef.current && !pendingRouteRef.current) {
      return;
    }

    const logo = logoRef.current;
    const currentContainer = document.querySelector(".main-content-container, main");

    const tl = gsap.timeline({
      onComplete: () => {
        isTransitioningRef.current = false;
        pendingRouteRef.current = null;
        setIsActive(false);

        if (currentContainer) {
          gsap.set(currentContainer, { clearProps: "transform,opacity,willChange" });
        }
        if (pathRef.current) {
          pathRef.current.setAttribute("d", generatePath(0, true)); // Reset to empty
        }
      },
    });

    if (currentContainer) {
      gsap.set(currentContainer, { opacity: 0.5, willChange: "opacity" });
      tl.to(currentContainer, {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    if (logo) {
      tl.to(logo, { y: "80%", opacity: 0, duration: 0.8, ease: "power2.in" }, "<");
    }

    const pathObj = { p: 0 };
    tl.to(
      pathObj,
      {
        p: 1,
        duration: 1.1,
        ease: "fluid",
        onUpdate: () => {
          if (pathRef.current) {
            pathRef.current.setAttribute("d", generatePath(pathObj.p, false));
          }
        },
      },
      "<"
    );
  }, [pathname]);

  // Click interceptor to handle internal navigation links with the push-down transition
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Only intercept internal non-hash routes, excluding studio links
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        !href.startsWith("/studio") &&
        target !== "_blank" &&
        !e.defaultPrevented
      ) {
        // If clicking on the exact current page, ignore
        if (href === pathname) return;
        if (isTransitioningRef.current) return;

        e.preventDefault();
        e.stopPropagation();

        isTransitioningRef.current = true;
        pendingRouteRef.current = href;
        setIsActive(true);

        const logo = logoRef.current;
        const currentContainer = document.querySelector(".main-content-container, main");

        if (pathRef.current) {
          pathRef.current.setAttribute("d", generatePath(0, true));
        }
        if (logo) {
          gsap.set(logo, { y: "-80%", opacity: 0 });
        }

        const tl = gsap.timeline({
          onComplete: () => {
            router.push(href);
          },
        });

        // 1. Current page fades out slightly (removed y transform to prevent SectionShader glitches)
        if (currentContainer) {
          gsap.set(currentContainer, { willChange: "opacity" });
          tl.to(
            currentContainer,
            {
              opacity: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            0
          );
        }

        // 2. Curtain overlay slides down smoothly with fluid wave
        const pathObj = { p: 0 };
        tl.to(
          pathObj,
          {
            p: 1,
            duration: 1.2,
            ease: "fluid",
            onUpdate: () => {
              if (pathRef.current) {
                pathRef.current.setAttribute("d", generatePath(pathObj.p, true));
              }
            },
          },
          0
        );

        // 3. Reveal minimalist logo in the center of transition curtain
        if (logo) {
          tl.to(
            logo,
            {
              y: "0%",
              opacity: 0.9,
              duration: 0.9,
              ease: "power3.out",
            },
            0.3
          );
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [pathname, router]);

  return (
    <>
      <svg className="fixed pointer-events-none w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id="curtain-clip" clipPathUnits="objectBoundingBox">
            <path ref={pathRef} d="M 0 0 Q 0.5 0 1 0 L 1 0 Q 0.5 0 0 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Sliding Transition Curtain */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 w-screen h-screen bg-[#12110E] z-[99998] will-change-[clip-path] ${
          isActive ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ clipPath: "url(#curtain-clip)" }}
      >
        {/* Subtle decorative grid/grain backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Minimalist Centered Brand Mark during transition */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div ref={logoRef} className="flex flex-col items-center gap-3 will-change-[transform,opacity] opacity-0">
            <Image
              src="/mycelius-logo.png"
              alt="Mycelius"
              width={180}
              height={60}
              className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
              priority
            />
            <div className="flex items-center justify-center mt-2">
              <span className="animate-pulse text-[10px] tracking-[0.25em] uppercase font-mono text-[#D4D0C9]">
                Cultivating View
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

