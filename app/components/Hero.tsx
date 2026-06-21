"use client";

import { useEffect, useRef } from "react";
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
  uniform float uSpread;
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

    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue = fbm(centeredUv * 15.0);
    float d = dissolveEdge + noiseValue * uSpread;

    float pixelSize = 1.0 / uResolution.y;
    float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.89, g: 0.89, b: 0.89 };
}

interface HeroShaderProps {
  color?: string;
  spread?: number;
  speed?: number;
  scrollTarget?: string;
}

function HeroShader({
  color = "#ffffff",
  spread = 0.5,
  speed = 1.0,
  scrollTarget = "#home-video-wrapper",
}: HeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const heroElement = document.querySelector(scrollTarget) as HTMLElement;
    if (!heroElement) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });

    const rgb = hexToRgb(color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(heroElement.offsetWidth, heroElement.offsetHeight),
        },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: spread },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resizeWebGL = () => {
      if (!heroElement || !renderer || !material) return;
      const width = heroElement.offsetWidth;
      const height = heroElement.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(width, height);
    };

    resizeWebGL();
    window.addEventListener("resize", resizeWebGL);

    let targetProgress = 0;
    const handleScroll = () => {
      if (!heroElement) return;
      const scroll = window.scrollY;
      const maxScroll = heroElement.offsetHeight;
      if (maxScroll > 0) {
        targetProgress = Math.min((scroll / maxScroll) * speed, 1.1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let animationFrameId: number;
    let lastRenderedProgress = -1;

    const animateWebGL = () => {
      if (!material || !renderer) return;
      
      const diff = targetProgress - material.uniforms.uProgress.value;
      
      // If the difference is meaningful, continue interpolating and rendering
      if (Math.abs(diff) > 0.001) {
        material.uniforms.uProgress.value += diff * 0.08;
        renderer.render(scene, camera);
        lastRenderedProgress = material.uniforms.uProgress.value;
      } 
      // If we just reached the target, do one final exact render and then sleep
      else if (lastRenderedProgress !== targetProgress) {
        material.uniforms.uProgress.value = targetProgress;
        renderer.render(scene, camera);
        lastRenderedProgress = targetProgress;
      }
      
      animationFrameId = requestAnimationFrame(animateWebGL);
    };
    animateWebGL();

    return () => {
      window.removeEventListener("resize", resizeWebGL);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [color, spread, speed, scrollTarget]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas absolute inset-0 w-full h-full pointer-events-none z-5"
    />
  );
}

export default function Hero() {
  return (
    <section id="home" className="hero relative w-full h-screen overflow-visible">
      {/* Background Video */}
      <div id="hero-video-wrapper" className="hero-img absolute inset-0 w-full h-[120vh] overflow-hidden origin-center will-change-transform z-1">
        <video
          src="/hero-video-3.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* WebGL scroll shader */}
      <HeroShader color="#ffffff" spread={0.5} speed={1.0} scrollTarget="#hero-video-wrapper" />

      {/* Hero Text Overlay */}
      <div className="hero-content absolute inset-0 w-full h-svh px-6 sm:px-8 flex flex-col items-center justify-center text-center z-10">
        <div className="hero-header w-full max-w-5xl flex flex-col items-center justify-center text-center font-suisse">
          <h1 className="text-white text-5xl sm:text-7xl md:text-[10vw] lg:text-[12svh] xl:text-[14svh] leading-[1.05] mb-6 text-center font-medium tracking-tight">
            Luxury.<br />
            Grown Slowly.
          </h1>
          <p className="text-white/90 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl text-xs sm:text-lg md:text-xl lg:text-[2.2svh] xl:text-[2.5svh] tracking-wide font-normal text-center leading-relaxed">
            Exclusive mycelium biomaterials for interiors, furniture and objects.
          </p>
        </div>
      </div>
    </section>
  );
}
