"use client";

import { useRef, useMemo, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
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

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!headingRef.current || !textRef.current) return;

    // Split the text into characters
    const headingSplit = new SplitText(headingRef.current, { type: "words,chars" });
    const textSplit = new SplitText(textRef.current, { type: "words,chars" });

    // Set initial low opacity on both sets of characters
    gsap.set([headingSplit.chars, textSplit.chars], { opacity: 0.15 });

    // Create timeline with scroll scrub trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        end: "center 42%",
        scrub: 1,
      },
    });

    // Sequence the character reveals
    tl.to(headingSplit.chars, {
      opacity: 1,
      stagger: 0.03,
      ease: "power1.out",
    });

    tl.to(textSplit.chars, {
      opacity: 1,
      stagger: 0.01,
      ease: "power1.out",
    }, "+=0.1");

    return () => {
      headingSplit.revert();
      textSplit.revert();
    };
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
        <h2 ref={headingRef} className="text-4xl md:text-6xl lg:text-[4.5rem] font-suisse font-medium text-[#12110E] leading-[1.1] tracking-tight mb-8">
          Designed Without Compromise.
        </h2>

        {/* Animated Paragraph */}
        <p ref={textRef} className="text-xl md:text-3xl lg:text-[2.3rem] font-suisse font-normal text-[#12110E]/80 leading-[1.35] tracking-[-0.015em] max-w-5xl">
          Architects shouldn&rsquo;t have to choose between aesthetics, performance and responsibility. We grow biomaterials that deliver all three, building a new material culture from fungi and agricultural waste.
        </p>
      </div>
    </section>
  );
}
