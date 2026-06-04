"use client";

import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

interface MushroomInstanceProps {
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
  targetY: number;
  targetRotation: [number, number, number];
  scale: number;
  scrollTriggerRef: React.RefObject<HTMLElement | null>;
}

function MushroomInstance({ initialPosition, initialRotation, targetY, targetRotation, scale, scrollTriggerRef }: MushroomInstanceProps) {
  const { scene } = useGLTF("/3d/mushroom.glb");
  const ref = useRef<THREE.Group>(null);

  // Clone scene so multiple instances don't share the same exact object reference
  const clone = useMemo(() => scene.clone(), [scene]);

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

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive ref={ref} object={clone} position={initialPosition} rotation={initialRotation} scale={scale} />
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
          initialPosition={[-11, -2, 0]}
          initialRotation={[0.2, 0.5, 0.1]}
          targetY={3}
          targetRotation={[0.5, 2.5, -0.2]}
          scale={3}
          scrollTriggerRef={sectionRef}
        />

        {/* Right Mushroom (starts slightly lower) */}
        <MushroomInstance
          initialPosition={[12, -6, -2]}
          initialRotation={[0.5, -2.8, 0.5]}
          targetY={1}
          targetRotation={[0.2, -1.5, 0.1]}
          scale={3}
          scrollTriggerRef={sectionRef}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3d/mushroom.glb");

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    // Split the text into characters
    const split = new SplitText(textRef.current, { type: "words,chars" });

    // Set initial low opacity
    gsap.set(split.chars, { opacity: 0.15 });

    // Scrub animation to fill the opacity of each character
    gsap.to(split.chars, {
      opacity: 1,
      stagger: 0.015,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%", // Start animation when the section is slightly visible
        end: "center center", // Finish animation when the section is in the middle of the screen
        scrub: 1, // Smooth scrubbing
      },
    });

  }, { scope: containerRef, dependencies: [] });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen bg-[#ffffff] px-8 overflow-hidden"
    >
      <Mushrooms sectionRef={containerRef} />

      <div className="max-w-6xl mx-auto relative z-10">
        <p ref={textRef} className="text-3xl md:text-5xl lg:text-[3.5rem] font-ppmori text-center font-normal text-[#0f0f0f] leading-[1.15] tracking-[-0.02em]">
          Mycelius develops exclusive mycelium biomaterials for architecture and interiors. We transform fungi and reclaimed waste into custom panels, furniture, and luminaires — combining circular systems with premium aesthetics. Sustainable design that feels as sophisticated as the spaces it inhabits.
        </p>
      </div>
    </section>
  );
}
