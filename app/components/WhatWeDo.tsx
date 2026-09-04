"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";


export interface Story {
  title: string[];
  storyImg: string;
}

export default function WhatWeDo({ stories }: { stories: Story[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const storyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioning = useRef(false);
  const directionRef = useRef<"next" | "prev">("next");

  const [activeStory, setActiveStory] = useState(0);
  const [prevStory, setPrevStory] = useState<number | null>(null);
  const [cursorText, setCursorText] = useState("Next");
  const [isOnImage, setIsOnImage] = useState(false);
  const isCursorVisible = useRef(false);
  const mousePositionRef = useRef({ x: -1000, y: -1000 });

  // Keep a ref of activeStory to avoid stale closures inside event listeners
  const activeStoryRef = useRef(activeStory);
  useEffect(() => {
    activeStoryRef.current = activeStory;
  }, [activeStory]);

  // GSAP animation for new image clipPath reveal
  const animateNewImage = (imgContainer: HTMLElement, currentDirection: "next" | "prev") => {
    gsap.set(imgContainer, {
      clipPath: currentDirection === "next" 
          ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" 
          : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    });
    gsap.to(imgContainer, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power4.inOut",
    });
  };

  // GSAP animation for image scaling and rotating transitions to match script.js
  const animateImageScale = (
    currentImg: HTMLImageElement,
    upcomingImg: HTMLImageElement,
    currentDirection: "next" | "prev",
    onComplete: () => void
  ) => {
    gsap.fromTo(currentImg, { scale: 1, rotate: 0 }, {
      scale: 2,
      rotate: currentDirection === "next" ? -25 : 25,
      duration: 1,
      ease: "power4.inOut",
    });

    gsap.fromTo(upcomingImg, { scale: 2, rotate: currentDirection === "next" ? 25 : -25 }, {
      scale: 1,
      rotate: 0,
      duration: 1,
      ease: "power4.inOut",
      onComplete: onComplete,
    });
  };

  // GSAP animations for exact index highlight transitions to match reference code
  const resetIndexHighlight = (highlight: HTMLElement, currentDirection: "next" | "prev") => {
    gsap.killTweensOf(highlight);
    
    // Calculate current width percentage so we can anchor the exit animation exactly
    // where the bar currently is, preventing any visual "jumping".
    const currentWidthPx = highlight.getBoundingClientRect().width;
    const parentWidthPx = highlight.parentElement?.getBoundingClientRect().width || 1;
    const currentWidthPct = (currentWidthPx / parentWidthPx) * 100;
    
    if (currentDirection === "next") {
      // Wiping out to the right: anchor its right edge to where it currently is,
      // then shrink width to 0 (pulls left edge to the right)
      gsap.set(highlight, { 
        left: "auto", 
        right: `${100 - currentWidthPct}%`,
        width: `${currentWidthPct}%`
      });
    } else {
      // Wiping out to the left: anchor its left edge to 0,
      // then shrink width to 0 (pulls right edge to the left)
      gsap.set(highlight, { 
        right: "auto", 
        left: 0,
        width: `${currentWidthPct}%`
      });
    }

    gsap.to(highlight, {
      width: "0%",
      duration: 0.7,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(highlight, { left: 0, right: "auto", width: "0%" });
      }
    });
  };

  const animateIndexHighlight = (highlight: HTMLElement) => {
    gsap.killTweensOf(highlight);
    gsap.set(highlight, { width: "0%", left: 0, right: "auto" });
    gsap.to(highlight, { width: "100%", duration: 4, ease: "none" });
  };

  // Harmonized GSAP Hook managing transitions on state changes
  useGSAP(() => {
    if (prevStory === null) {
      // Initial mount: animate the first highlight segment
      const activeHighlight = containerRef.current?.querySelector(`.index-highlight-0`) as HTMLElement;
      if (activeHighlight) {
        animateIndexHighlight(activeHighlight);
      }
      return;
    }

    // 1. Text Rolling Animations
    const direction = directionRef.current;
    const oldTitles0 = containerRef.current?.querySelectorAll(".old-title-text.title-0");
    const newTitles0 = containerRef.current?.querySelectorAll(".new-title-text.title-0");
    const oldTitles1 = containerRef.current?.querySelectorAll(".old-title-text.title-1");
    const newTitles1 = containerRef.current?.querySelectorAll(".new-title-text.title-1");
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (newTitles0) {
      // On mobile, upcoming text always comes from bottom (110). On desktop, respect direction.
      const startY = isMobile ? 110 : (direction === "next" ? 110 : -110);
      gsap.set(newTitles0, { yPercent: startY, y: 0 });
      gsap.to(newTitles0, { yPercent: 0, duration: 0.5, delay: 0.4 });
    }
    if (oldTitles0) {
      // On mobile, previous text always goes to top (-110). On desktop, respect direction.
      const endY = isMobile ? -110 : (direction === "next" ? -110 : 110);
      gsap.to(oldTitles0, { yPercent: endY, duration: 0.5, delay: 0.4 });
    }

    if (newTitles1) {
      gsap.set(newTitles1, { yPercent: direction === "next" ? -110 : 110, y: 0 });
      gsap.to(newTitles1, { yPercent: 0, duration: 0.5, delay: 0.4 });
    }
    if (oldTitles1) {
      gsap.to(oldTitles1, { yPercent: direction === "next" ? 110 : -110, duration: 0.5, delay: 0.4 });
    }

    // 2. Premium Image Transitions
    const newImgContainer = containerRef.current?.querySelector(".new-img-container") as HTMLElement;
    const oldImg = containerRef.current?.querySelector(".old-story-img") as HTMLImageElement;
    const newImg = containerRef.current?.querySelector(".new-story-img") as HTMLImageElement;

    if (newImgContainer) {
      animateNewImage(newImgContainer, direction);
    }

    if (oldImg && newImg) {
      animateImageScale(oldImg, newImg, direction, () => {
        setPrevStory(null);
        isTransitioning.current = false;
      });
    } else {
      setPrevStory(null);
      isTransitioning.current = false;
    }

    // Exact Index Highlight GSAP transitions
    const prevHighlight = containerRef.current?.querySelector(`.index-highlight-${prevStory}`) as HTMLElement;
    if (prevHighlight) {
      resetIndexHighlight(prevHighlight, direction);
    }

    const activeHighlight = containerRef.current?.querySelector(`.index-highlight-${activeStory}`) as HTMLElement;
    if (activeHighlight) {
      animateIndexHighlight(activeHighlight);
    }

    // Sync all remaining highlights instantly
    stories.forEach((_, i) => {
      if (i !== activeStory && i !== prevStory) {
        const hl = containerRef.current?.querySelector(`.index-highlight-${i}`) as HTMLElement;
        if (hl) {
          gsap.killTweensOf(hl);
          gsap.set(hl, { width: "0%", left: 0, right: "auto" });
        }
      }
    });

  }, { dependencies: [activeStory], scope: containerRef });

  const isSectionInView = useRef(false);

  // Perform slide change logic
  // forceAutoplay=true → always advance forward regardless of directionRef
  const changeStory = (targetIndex?: number, forceAutoplay = false) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    const previousStory = activeStoryRef.current;
    let nextStory: number;

    if (targetIndex !== undefined) {
      // Direct index jump (e.g. clicking a progress bar segment)
      nextStory = targetIndex;
      directionRef.current = targetIndex > previousStory ? "next" : "prev";
    } else if (forceAutoplay) {
      // Autoplay always advances forward
      directionRef.current = "next";
      nextStory = (previousStory + 1) % stories.length;
    } else {
      // Click-driven: respect directionRef set by mouse position
      if (directionRef.current === "next") {
        nextStory = (previousStory + 1) % stories.length;
      } else {
        nextStory = (previousStory - 1 + stories.length) % stories.length;
      }
    }

    setPrevStory(previousStory);
    setActiveStory(nextStory);

    // Only queue the next autoplay if the section is actively in view
    if (storyTimeoutRef.current) {
      clearTimeout(storyTimeoutRef.current);
    }
    if (isSectionInView.current) {
      storyTimeoutRef.current = setTimeout(() => {
        changeStory(undefined, true);
      }, 4000);
    }
  };

  // Quick setters for highly performant GSAP cursor tracking
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(() => {
    if (cursorRef.current) {
      xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power2.out" });
      yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power2.out" });
    }
  }, { scope: containerRef });

  const handleMouseEnter = (event?: React.MouseEvent | { clientX: number; clientY: number }) => {
    if (cursorRef.current && !isCursorVisible.current) {
      isCursorVisible.current = true;

      if (event) {
        gsap.set(cursorRef.current, {
          x: event.clientX - 50,
          y: event.clientY - 50,
        });
      }

      gsap.to(cursorRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (cursorRef.current && isCursorVisible.current) {
      isCursorVisible.current = false;
      gsap.to(cursorRef.current, {
        opacity: 0,
        scale: 0.75,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  // Handle custom cursor coordinate updates
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined" || !cursorRef.current) return;
    
    const { clientX, clientY } = event;
    mousePositionRef.current = { x: clientX, y: clientY };

    if (!isCursorVisible.current) {
      handleMouseEnter(event);
    }

    if (xTo.current && yTo.current) {
      xTo.current(clientX - 50);
      yTo.current(clientY - 50);
    }

    // Only update React state if the direction actually changes!
    const isLeft = clientX < window.innerWidth / 2;
    const newDirection = isLeft ? "prev" : "next";
    
    if (directionRef.current !== newDirection) {
      directionRef.current = newDirection;
      setCursorText(isLeft ? "Prev" : "Next");
    }
  };

  // IntersectionObserver to start/pause autoplay only when WhatWeDo is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isSectionInView.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (storyTimeoutRef.current) clearTimeout(storyTimeoutRef.current);
          storyTimeoutRef.current = setTimeout(() => {
            changeStory(undefined, true);
          }, 4000);
        } else {
          if (storyTimeoutRef.current) {
            clearTimeout(storyTimeoutRef.current);
            storyTimeoutRef.current = null;
          }
          if (isCursorVisible.current) {
            handleMouseLeave();
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (storyTimeoutRef.current) {
        clearTimeout(storyTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories.length]);

  // Handle screen taps/clicks for navigation
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest(".indices")
    ) {
      return;
    }

    if (isTransitioning.current) return;

    const { clientX } = e;
    if (clientX < window.innerWidth / 2) {
      directionRef.current = "prev";
    } else {
      directionRef.current = "next";
    }

    changeStory();
  };


  return (
    <section
      id="what-we-do"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
      className="custom-carousel-container relative w-full h-svh text-[#12110E] select-none overflow-hidden bg-[#ffffff] flex items-center justify-center"
    >
      {/* cursor:none on whole section */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-carousel-container {
          cursor: none !important;
        }
        .custom-carousel-container * {
          cursor: none !important;
        }
        @media (max-width: 900px) {
          .custom-carousel-container,
          .custom-carousel-container * {
            cursor: default !important;
          }
        }
      `}} />

      {/* Custom Mouse Cursor — solid orange everywhere, glass effect on image */}
      <div
        ref={cursorRef}
        className={`cursor fixed top-0 left-0 w-25 h-25 hidden md:flex justify-center items-center rounded-full pointer-events-none z-100 opacity-0 scale-75 transition-[background-color,border] duration-300 transform-gpu will-change-transform ${isOnImage ? 'backdrop-blur-sm border border-[#FF6118]/60' : ''}`}
        style={{ 
          backgroundColor: isOnImage ? 'rgba(255, 97, 24, 0.45)' : '#FF6118',
          transform: 'translate3d(-1000px, -1000px, 0)'
        }}
      >
        <p className="text-xs uppercase text-white font-normal tracking-wider select-none">
          {cursorText}
        </p>
      </div>


      {/* Central Interactive Card Wrapper */}
      <div className="relative w-[90vw] md:w-[75vw] lg:w-[60vw] h-[55vh] md:h-[65vh] lg:h-[75vh]">
        
        {/* LAYER 1: BLACK TEXT (Behind the image, overflows naturally over the white background) */}
        {/* Line 0: Overlapping below top left corner */}
        <div className="absolute max-md:top-[calc(100%+16px)] max-md:bottom-auto max-md:left-0 max-md:w-full md:top-[4%] md:left-[-25%] xl:left-[-30%] w-[90vw] md:w-[80vw] overflow-hidden pointer-events-none z-10 grid">
          {prevStory !== null && stories[prevStory].title[0] && (
            <h1 className={`old-title-text title-0 col-start-1 row-start-1 justify-self-start max-md:justify-self-center whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-md:text-[44px] max-sm:text-[36px] font-normal text-[#12110E] leading-none tracking-tight px-[0.2em] py-[0.05em] relative ${stories[prevStory].title[0] === "Wall" ? "left-[3vw] md:left-[5vw] lg:left-[6vw] max-md:left-0" : ""}`}>
              {stories[prevStory].title[0]}<span className="md:hidden"> {stories[prevStory].title[1]}</span>
            </h1>
          )}
          <h1 className={`new-title-text title-0 col-start-1 row-start-1 justify-self-start max-md:justify-self-center whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-md:text-[44px] max-sm:text-[36px] font-normal text-[#12110E] leading-none tracking-tight px-[0.2em] py-[0.05em] relative ${stories[activeStory].title[0] === "Wall" ? "left-[3vw] md:left-[5vw] lg:left-[6vw] max-md:left-0" : ""}`}>
            {stories[activeStory].title[0]}<span className="md:hidden"> {stories[activeStory].title[1]}</span>
          </h1>
        </div>

        {/* Line 1: Overlapping above bottom right corner */}
        <div className="absolute max-md:hidden md:bottom-[4%] md:right-[-25%] xl:right-[-30%] overflow-hidden pointer-events-none z-10 grid">
          {prevStory !== null && stories[prevStory].title[1] && (
            <h1 className="old-title-text title-1 col-start-1 row-start-1 justify-self-end whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-sm:text-[40px] font-normal text-[#12110E] leading-none tracking-tight px-[0.2em] py-[0.05em] text-right">
              {stories[prevStory].title[1]}
            </h1>
          )}
          <h1 className="new-title-text title-1 col-start-1 row-start-1 justify-self-end whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-sm:text-[40px] font-normal text-[#12110E] leading-none tracking-tight px-[0.2em] py-[0.05em] text-right">
            {stories[activeStory].title[1]}
          </h1>
        </div>

        {/* LAYER 2: STORY IMAGES CANVAS (Opaque, completely hides the black text beneath it) */}
        <div
          className="story-img absolute inset-0 w-full h-full overflow-hidden bg-[#ffffff] z-20 will-change-transform transform-gpu"
          onMouseEnter={() => setIsOnImage(true)}
          onMouseLeave={() => setIsOnImage(false)}
        >
          {prevStory !== null && (
            <div className="img absolute inset-0 w-full h-full old-img-container">
              <Image 
                src={stories[prevStory].storyImg} 
                alt={`Mycelius crafted ${stories[prevStory].title.join(" ")}`} 
                fill 
                unoptimized 
                className="object-cover old-story-img will-change-transform transform-gpu" 
              />
            </div>
          )}
          <div className="img absolute inset-0 w-full h-full new-img-container">
            <Image 
              src={stories[activeStory].storyImg} 
              alt={`Mycelius crafted ${stories[activeStory].title.join(" ")}`} 
              fill 
              priority 
              unoptimized 
              className="object-cover new-story-img will-change-transform transform-gpu" 
            />
          </div>

          {/* LAYER 3: WHITE TEXT (Inside image container, physically clipped by overflow-hidden at the exact image boundary) */}
          {/* Line 0: White Text */}
          <div className="absolute max-md:top-[calc(100%+16px)] max-md:bottom-auto max-md:left-0 max-md:w-full md:top-[4%] md:left-[-25%] xl:left-[-30%] w-[90vw] md:w-[80vw] overflow-hidden pointer-events-none z-30 grid">
            {prevStory !== null && stories[prevStory].title[0] && (
              <h1 className={`old-title-text title-0 col-start-1 row-start-1 justify-self-start max-md:justify-self-center whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-md:text-[44px] max-sm:text-[36px] font-normal text-white leading-none tracking-tight px-[0.2em] py-[0.05em] relative ${stories[prevStory].title[0] === "Wall" ? "left-[3vw] md:left-[5vw] lg:left-[6vw] max-md:left-0" : ""}`}>
                {stories[prevStory].title[0]}<span className="md:hidden"> {stories[prevStory].title[1]}</span>
              </h1>
            )}
            <h1 className={`new-title-text title-0 col-start-1 row-start-1 justify-self-start max-md:justify-self-center whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-md:text-[44px] max-sm:text-[36px] font-normal text-white leading-none tracking-tight px-[0.2em] py-[0.05em] relative ${stories[activeStory].title[0] === "Wall" ? "left-[3vw] md:left-[5vw] lg:left-[6vw] max-md:left-0" : ""}`}>
              {stories[activeStory].title[0]}<span className="md:hidden"> {stories[activeStory].title[1]}</span>
            </h1>
          </div>

          {/* Line 1: White Text */}
          <div className="absolute max-md:hidden md:bottom-[4%] md:right-[-25%] xl:right-[-30%] overflow-hidden pointer-events-none z-30 grid">
            {prevStory !== null && stories[prevStory].title[1] && (
              <h1 className="old-title-text title-1 col-start-1 row-start-1 justify-self-end whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-sm:text-[40px] font-normal text-white leading-none tracking-tight px-[0.2em] py-[0.05em] text-right">
                {stories[prevStory].title[1]}
              </h1>
            )}
            <h1 className="new-title-text title-1 col-start-1 row-start-1 justify-self-end whitespace-nowrap text-[60px] md:text-[80px] lg:text-[100px] max-sm:text-[40px] font-normal text-white leading-none tracking-tight px-[0.2em] py-[0.05em] text-right">
              {stories[activeStory].title[1]}
            </h1>
          </div>
        </div>

        {/* LAYER 4: Segmented Progress indicators */}
        <div className="absolute max-md:-top-10 max-md:bottom-auto -bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto w-[80%] md:w-[40%] mx-auto px-1 z-40">
          <div 
            className="indices w-full h-2.5 flex justify-between items-center gap-[0.25em]"
            role="tablist"
            aria-label="What we do story slides"
          >
            {stories.map((story, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === activeStory}
                aria-label={`View slide ${idx + 1} of ${stories.length}: ${story.title.join(" ")}`}
                className="relative w-full py-3 cursor-pointer flex items-center group bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
                onClick={() => {
                  if (!isTransitioning.current && idx !== activeStoryRef.current) {
                    if (storyTimeoutRef.current) {
                      clearTimeout(storyTimeoutRef.current);
                    }
                    directionRef.current = idx > activeStoryRef.current ? "next" : "prev";
                    changeStory(idx);
                  }
                }}
              >
                <div className="index w-full h-1 rounded-3xl bg-black/40 relative overflow-hidden">
                  <div
                    className={`index-highlight absolute top-0 h-full bg-black index-highlight-${idx}`}
                    style={
                      idx === activeStory || idx === prevStory
                        ? undefined
                        : { width: "0%", left: 0, right: "auto" }
                    }
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
