"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

interface AdvantageItem {
  title: string;
  iconPath: string;
  filter: string;
}

const ADVANTAGES_DATA: AdvantageItem[] = [
  { title: "Biodegradable", iconPath: "/biodegradable-icon.png", filter: "none" },
  { title: "Non-Toxic", iconPath: "/non-toxic-icon.png", filter: "invert(1)" },
  { title: "Fire Retardant", iconPath: "/fire-retardant-icon.png", filter: "none" },
  { title: "Natural Insulation", iconPath: "/natural-insulation-icon.png", filter: "invert(1)" },
  { title: "Made in India", iconPath: "/made-in-india-icon.png", filter: "invert(1)" },
];

export default function ProductAdvantage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Intro Section Pinning & Parallax Scroll
    const introSection = containerRef.current?.querySelector(".advantage-intro-section");
    const introHeading = containerRef.current?.querySelector(".advantage-intro-heading");
    const introContent = containerRef.current?.querySelector(".advantage-intro-content");

    if (introSection) {
      ScrollTrigger.create({
        trigger: introSection,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        pinType: "transform",
      });

      if (introContent) {
        gsap.to(introContent, {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: introSection,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      if (introHeading) {
        const introChars = gsap.utils.toArray(".intro-char", introSection) as HTMLElement[];
        
        const charData = introChars.map(() => ({
          y: gsap.utils.random(200, 350),
          x: gsap.utils.random(-40, 40),
          rotation: gsap.utils.random(-80, 80),
          startProgress: gsap.utils.random(0, 0.4),
          duration: gsap.utils.random(0.5, 0.6)
        }));

        introChars.forEach((char, i) => {
          gsap.set(char, {
            y: charData[i].y,
            x: charData[i].x,
            rotation: charData[i].rotation,
            opacity: 0
          });
        });

        ScrollTrigger.create({
          trigger: introSection,
          start: "top 50%",
          end: "top -50%",
          scrub: 1.2,
          onUpdate: (self) => {
            introChars.forEach((char, i) => {
              const data = charData[i];
              const rawProgress = (self.progress - data.startProgress) / data.duration;
              const progress = Math.min(1, Math.max(0, rawProgress));
              
              // Cubic ease out
              const easedProgress = 1 - Math.pow(1 - progress, 3);
              
              gsap.set(char, {
                y: data.y - easedProgress * data.y,
                x: data.x - easedProgress * data.x,
                rotation: data.rotation - easedProgress * data.rotation,
                opacity: easedProgress
              });
            });
          }
        });
      }
    }

    const titles = gsap.utils.toArray(".advantage-title-item") as HTMLElement[];

    titles.forEach((title, index) => {
      const titleContainer = title.querySelector(".advantage-title-container");
      if (!titleContainer) return;

      const chars = gsap.utils.toArray(".advantage-char", title) as HTMLElement[];
      const charCount = chars.length;
      if (charCount === 0) return;

      const icon = title.querySelector(".advantage-icon") as HTMLElement | null;

      const titleContainerInitialX = index % 2 === 1 ? -100 : 100;

      // Set initial Y position for characters
      chars.forEach((char, i) => {
        const charInitialY = i % 2 === 0 ? -150 : 150;
        gsap.set(char, { y: charInitialY });
      });

      // Set initial X position for title container
      gsap.set(titleContainer, { x: `${titleContainerInitialX}%` });

      // Set initial state for icon
      if (icon) {
        gsap.set(icon, { opacity: 0, scale: 0.5, rotation: -30 });
      }

      ScrollTrigger.create({
        trigger: title,
        start: "top bottom",
        end: "center center",
        scrub: 1,
        onUpdate: (self) => {
          // Handle horizontal container animation
          const titleContainerX =
            titleContainerInitialX - self.progress * titleContainerInitialX;
          gsap.set(titleContainer, { x: `${titleContainerX}%` });

          // Animate icon fade, scale and rotation
          if (icon) {
            const iconProgress = Math.min(1, Math.max(0, (self.progress - 0.25) / 0.55));
            gsap.set(icon, {
              opacity: iconProgress,
              scale: 0.5 + iconProgress * 0.5,
              rotation: -30 + iconProgress * 30,
            });
          }

          // Handle staggered character animation
          chars.forEach((char, i) => {
            const charStaggerIndex = index % 2 === 1 ? charCount - 1 - i : i;

            const charStartDelay = 0.1;
            const charTimelineSpan = 1 - charStartDelay;
            const staggerFactor = Math.min(0.75, charTimelineSpan * 0.75);
            const delay =
              charStartDelay + (charStaggerIndex / charCount) * staggerFactor;
            const duration =
              charTimelineSpan - (staggerFactor * (charCount - 1)) / charCount;
            const start = delay;

            let charProgress = 0;
            if (self.progress >= start) {
              charProgress = Math.min(1, (self.progress - start) / duration);
            }

            const charInitialY = i % 2 === 0 ? -150 : 150;
            const charY = charInitialY - charProgress * charInitialY;
            gsap.set(char, { y: charY });
          });
        },
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-[#12110E] text-white">
      {/* Intro Section */}
      <section className="advantage-intro-section relative w-full h-screen flex flex-col items-center justify-center text-center px-4 bg-[#12110E] overflow-hidden select-none z-0">
        <div className="advantage-intro-content flex flex-col items-center justify-center text-center">
          <h1 className="advantage-intro-heading text-[1.3rem] xs:text-[1.8rem] sm:text-[3vw] md:text-[4vw] lg:text-[5vw] xl:text-[5.8rem] font-medium leading-none tracking-tight lg:tracking-[-0.03em] xl:tracking-[-0.25rem] text-white font-sans whitespace-nowrap select-none flex flex-wrap justify-center gap-[0.3em] md:gap-[0.4em]">
            {"Our Products Are".split(" ").map((word, wIndex) => (
              <span key={wIndex} className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIndex) => (
                  <span
                    key={cIndex}
                    className="intro-char relative inline-block will-change-transform"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Animated Titles */}
      <section className="relative w-full overflow-hidden flex flex-col">
        {ADVANTAGES_DATA.map((adv, index) => (
          <div
            key={index}
            className={`advantage-title-item h-[110svh] flex flex-col items-center justify-start w-full overflow-hidden ${index % 2 === 1 ? "bg-[#12110E]" : "bg-[#F15B20]"
              }`}
            style={{
              clipPath:
                index % 2 === 0
                  ? "polygon(0 20svh, 100% 0, 100% calc(100% - 20svh), 0 100%)"
                  : "polygon(0 0, 100% 20svh, 100% 100%, 0 calc(100% - 20svh))",
              marginBottom: index === ADVANTAGES_DATA.length - 1 ? "0" : "-40svh",
              position: "relative",
              zIndex: 20 + index,
            }}
          >
            <div className="advantage-title-container w-full h-[90svh] flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 will-change-transform px-6 max-w-7xl mx-auto">
              {/* Icon Container */}
              <div className="advantage-icon relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 flex-shrink-0 flex items-center justify-center will-change-transform">
                <Image
                  src={adv.iconPath}
                  alt={`${adv.title} icon`}
                  fill
                  sizes="(max-width: 768px) 96px, (max-width: 1024px) 144px, 176px"
                  className={`object-contain ${adv.title === "Made in India" ? "scale-140 md:scale-130 lg:scale-125" : ""}`}
                  style={{ filter: adv.filter }}
                />
              </div>

              {/* Large Animated Title */}
              <h2 className={`text-[1.3rem] xs:text-[1.8rem] sm:text-[3vw] md:text-[4vw] lg:text-[5vw] xl:text-[5.8rem] font-medium leading-none tracking-tight lg:tracking-[-0.03em] xl:tracking-[-0.25rem] font-sans whitespace-nowrap select-none ${index % 2 === 1 ? "text-white" : "text-[#12110E]"
                }`}>
                {adv.title.split("").map((char, i) => (
                  <span
                    key={i}
                    className="advantage-char relative inline-block will-change-transform"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        ))}
      </section>

      {/* Outro Section */}
      <section
        className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4 bg-[#12110E] overflow-hidden select-none"
        style={{
          clipPath: "polygon(0 0, 100% 20svh, 100% 100%, 0 100%)",
          position: "relative",
          zIndex: 30,
          marginTop: "-40svh",
        }}
      >
        <h1 className="text-[1.3rem] xs:text-[1.8rem] sm:text-[3vw] md:text-[4vw] lg:text-[5vw] xl:text-[5.8rem] font-medium leading-none tracking-tight lg:tracking-[-0.03em] xl:tracking-[-0.25rem] text-white font-sans uppercase">
          incubators
        </h1>
      </section>
    </div>
  );
}
