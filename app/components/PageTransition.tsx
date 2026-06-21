"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

    float noiseValue = fbm(centeredUv * 4.5);

    float threshold = uProgress * 1.15;
    float d = (noiseValue + 0.1) - threshold;

    float pixelSize = 1.0 / uResolution.y;
    float alpha = smoothstep(-pixelSize * 1.5, pixelSize * 1.5, d);

    gl_FragColor = vec4(uColor, 1.0 - alpha);
  }
`;

export default function PageTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [overlayActive, setOverlayActive] = useState(false);

  // Animation state refs
  const targetProgressRef = useRef(0.0);
  const currentProgressRef = useRef(0.0);
  const pendingRouteRef = useRef<string | null>(null);
  const isNavigatingRef = useRef(false);

  // Pathname change hook: when routing completes, trigger reveal
  useEffect(() => {
    targetProgressRef.current = 0.0;
    pendingRouteRef.current = null;
    isNavigatingRef.current = false;
  }, [pathname]);

  // Click interceptor to handle internal navigation links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");

      // Only intercept internal non-hash links
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        target !== "_blank" &&
        !e.defaultPrevented
      ) {
        // Don't transition if we're already on the same page
        if (href === pathname) return;

        e.preventDefault();
        e.stopPropagation();

        setOverlayActive(true);
        targetProgressRef.current = 1.25;
        pendingRouteRef.current = href;
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [pathname]);

  // WebGL Initialization & Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Mycelius deep charcoal: #12110E
    const color = new THREE.Vector3(18 / 255, 17 / 255, 14 / 255);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uColor: { value: color },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let animationFrameId: number;

    const animate = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        const speed = target > 0 ? 0.025 : 0.02;
        currentProgressRef.current += diff * speed;
        material.uniforms.uProgress.value = currentProgressRef.current;
        renderer.render(scene, camera);
      } else if (current !== target) {
        currentProgressRef.current = target;
        material.uniforms.uProgress.value = target;
        renderer.render(scene, camera);
      }

      // Cover animation completed — push route
      if (
        currentProgressRef.current >= 1.2 &&
        pendingRouteRef.current &&
        !isNavigatingRef.current
      ) {
        isNavigatingRef.current = true;
        const route = pendingRouteRef.current;
        router.push(route);
      }

      // Reveal transition completed — release overlay
      if (currentProgressRef.current <= 0.01 && target === 0) {
        setOverlayActive(false);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-screen h-screen z-[99999] ${
        overlayActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    />
  );
}
