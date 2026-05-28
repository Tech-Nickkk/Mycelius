"use client";

import { useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function MushroomInstance({ initialPosition, initialRotation, targetY, targetRotation, scale, scrollTriggerRef }: any) {
  const { scene } = useGLTF("/3d/mushroom.glb");
  const ref = useRef<THREE.Group>(null);

  // Clone scene so multiple instances don't share the same exact object reference
  const clone = useMemo(() => scene.clone(), [scene]);

  useGSAP(() => {
    if (!ref.current || !scrollTriggerRef.current) return;

    // Use ScrollTrigger to animate Y position 
    gsap.to(ref.current.position, {
      y: targetY,
      ease: "none",
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Use ScrollTrigger to animate Rotation
    gsap.to(ref.current.rotation, {
      x: targetRotation[0],
      y: targetRotation[1],
      z: targetRotation[2],
      ease: "none",
      scrollTrigger: {
        trigger: scrollTriggerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, { scope: scrollTriggerRef });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive ref={ref} object={clone} position={initialPosition} rotation={initialRotation} scale={scale} />
    </Float>
  );
}

export default function Mushrooms({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
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
