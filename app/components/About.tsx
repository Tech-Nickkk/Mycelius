"use client";

import { useRef, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MushroomInstanceProps {
  side: "left" | "right";
  scrollTriggerRef: React.RefObject<HTMLElement | null>;
}

function MushroomInstance({ side, scrollTriggerRef }: MushroomInstanceProps) {
  const { scene } = useGLTF("/3d/mushroom.glb");
  const { viewport } = useThree();
  const ref = useRef<THREE.Group>(null);

  // Clone scene so multiple instances don't share the same exact object reference
  const clone = useMemo(() => scene.clone(), [scene]);

  // Viewport-based responsive scaling and position calculations
  const isMobile = viewport.width < 12;
  const scale = isMobile ? Math.max(1.2, viewport.width * 0.22) : 3;
  const margin = isMobile ? 0.3 : 1;

  // Horizontal edge placement based on dynamic viewport width
  const initialX = side === "left" 
    ? -viewport.width / 2 + (isMobile ? 0.8 : 2.2) 
    : viewport.width / 2 - margin;

  const initialY = side === "left" ? -5 : -9;
  const targetY = side === "left" ? 3 : 1;
  const zPosition = side === "left" ? 0 : -2;

  const initialRotation: [number, number, number] = side === "left" 
    ? [0.2, 0.5, 0.1] 
    : [0.5, -2.8, 0.5];

  const targetRotation: [number, number, number] = side === "left"
    ? [0.5, 2.5, -0.2]
    : [0.2, -1.5, 0.1];

  useGSAP(() => {
    if (!ref.current || !scrollTriggerRef.current) return;

    // Use a single timeline and ScrollTrigger instance for better performance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });

    // Animate both position and rotation simultaneously
    tl.to(ref.current.position, { y: targetY, ease: "none" }, 0);
    tl.to(ref.current.rotation, {
      x: targetRotation[0],
      y: targetRotation[1],
      z: targetRotation[2],
      ease: "none"
    }, 0);
  }, { dependencies: [] });

  // Update responsive horizontal positions on resize or layout changes
  // We leave position.y and rotation alone since they are controlled by the GSAP timeline
  useEffect(() => {
    if (ref.current) {
      ref.current.position.x = initialX;
      ref.current.position.z = zPosition;
    }
  }, [initialX, zPosition]);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive 
        ref={ref} 
        object={clone} 
        scale={scale} 
        position={[initialX, initialY, zPosition]} 
        rotation={initialRotation} 
      />
    </Float>
  );
}

function Mushrooms({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <Environment preset="city" />

        {/* Left Mushroom */}
        <MushroomInstance
          side="left"
          scrollTriggerRef={sectionRef}
        />

        {/* Right Mushroom */}
        <MushroomInstance
          side="right"
          scrollTriggerRef={sectionRef}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3d/mushroom.glb");

const gradientTextFillStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to top, #12110E 50%, rgba(18, 17, 14, 0.15) 50%)",
  backgroundSize: "100% 200%",
  backgroundPosition: "0% 0%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!headingRef.current || !textRef.current) return;

    // Get all fill-line elements from both heading and paragraph
    const headingLines = headingRef.current.querySelectorAll(".fill-line");
    const paragraphLines = textRef.current.querySelectorAll(".fill-line");

    // Create timeline with scroll scrub trigger (start top 78% to play title animation a bit later on scroll)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 78%",
        end: "center 38%",
        scrub: 1,
      },
    });

    // Sequence the heading line reveals with stagger, starting first
    tl.to(headingLines, {
      backgroundPosition: "0% 100%",
      stagger: 0.1,
      ease: "power1.out",
    }, 0);

    // Sequence the paragraph line reveals, starting slightly later (time 0.12)
    tl.to(paragraphLines, {
      backgroundPosition: "0% 100%",
      stagger: 0.05,
      ease: "power1.out",
    }, 0.12);
  }, { scope: containerRef, dependencies: [] });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen bg-[#ffffff] px-8 overflow-hidden"
    >
      <Mushrooms sectionRef={containerRef} />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center -translate-y-12 md:-translate-y-20">
        {/* Heading */}
        <h2 ref={headingRef} className="text-4xl md:text-6xl lg:text-[4.5rem] font-suisse font-medium leading-[1.1] tracking-tight mb-8 text-center">
          <span className="fill-line block will-change-[background-position]" style={gradientTextFillStyle}>
            Designed Without Compromise.
          </span>
        </h2>

        {/* Animated Paragraph */}
        <p ref={textRef} className="text-xl md:text-3xl lg:text-[2.3rem] font-suisse font-normal leading-[1.35] tracking-[-0.015em] max-w-5xl text-center">
          <span className="fill-line block will-change-[background-position]" style={gradientTextFillStyle}>
            Architects shouldn&rsquo;t have to choose between aesthetics, performance and responsibility. We grow biomaterials that deliver all three, building a new material culture from fungi and agricultural waste.
          </span>
        </p>
      </div>
    </section>
  );
}
