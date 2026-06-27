"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface LimitedEditionItem {
  name: string;
  status: string;
  image: string;
  description?: string;
}

interface Props {
  items: LimitedEditionItem[];
  showLink?: boolean;
}

export default function LimitedEditions({ items, showLink = true }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      if (titleRef.current) {
        tl.from(titleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".le-card");
        tl.from(
          cards,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-[#12110E] text-white overflow-hidden border-t border-white/10"
    >
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center">
        <h2
          ref={titleRef}
          className="text-[10vw] md:text-[6vw] font-normal tracking-tight text-center leading-none font-ppeditorial mb-6"
        >
          Limited Editions
        </h2>
        
        <p className="text-center text-white/70 max-w-2xl text-[4vw] md:text-[1.2vw] font-suisse leading-relaxed mb-16">
          A small collection of objects grown in our lab. Produced in extremely limited quantities and released when available.
        </p>

        <div
          ref={gridRef}
          className="w-full flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="le-card group flex flex-col w-full md:w-[28vw] max-w-md"
            >
              <div className="relative w-full aspect-4/5 overflow-hidden rounded-2xl skeleton-shimmer-dark bg-white/5 mb-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Exclusivity Badge */}
                <div className="absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full backdrop-blur-md bg-black/40 border border-white/20 text-[0.8rem] font-suisse tracking-wider uppercase text-white shadow-lg">
                  {item.status}
                </div>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-[6vw] md:text-[2vw] font-ppeditorial leading-tight mb-2">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-white/60 text-sm md:text-base font-suisse line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {showLink && items.length > 0 && (
          <div className="mt-20">
            <Link
              href="/limited-editions"
              className="group relative inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/30 hover:border-white/80 transition-colors duration-300"
            >
              <span className="font-suisse text-sm uppercase tracking-widest text-white">
                View Full Collection
              </span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                &rarr;
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
