"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  uniform float uInvert;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec2 k = vec2(0.3183099, 0.3678794);
    p = p * k + vec2(p.y, p.x);
    return fract(16.0 * sin(p.x * p.y * (p.x + p.y)));
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
    float alpha = smoothstep(-pixelSize, pixelSize, d);

    if (uInvert > 0.5) {
      alpha = 1.0 - alpha;
    }

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

interface SectionShaderProps {
  color?: string;
  spread?: number;
  speed?: number;
  scrollTarget?: string;
  sizeTarget?: string;
  playLate?: boolean;
  invert?: boolean;
}

export default function SectionShader({
  color = "#ffffff",
  spread = 0.5,
  speed = 1.0,
  scrollTarget = "#black-section",
  sizeTarget,
  playLate = false,
  invert = false,
}: SectionShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sectionElement = document.querySelector(scrollTarget) as HTMLElement;
    if (!sectionElement) return;

    const sizeElement = sizeTarget ? document.querySelector(sizeTarget) as HTMLElement : sectionElement;
    if (!sizeElement) return;

    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.BufferGeometry;
    let isVisible = false;
    let targetProgress = 0;
    let animationFrameId: number | null = null;
    let isRunning = false;

    try {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      });

      const rgb = hexToRgb(color);
      geometry = new THREE.PlaneGeometry(2, 2);
      
      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(sectionElement.offsetWidth, sectionElement.offsetHeight),
          },
          uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
          uSpread: { value: spread },
          uInvert: { value: invert ? 1.0 : 0.0 },
        },
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animateWebGL = () => {
        if (!material || !renderer) {
          isRunning = false;
          return;
        }

        const diff = targetProgress - material.uniforms.uProgress.value;
        
        if (Math.abs(diff) > 0.0008) {
          material.uniforms.uProgress.value += diff * 0.06;
          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animateWebGL);
        } else {
          material.uniforms.uProgress.value = targetProgress;
          renderer.render(scene, camera);
          isRunning = false;
          animationFrameId = null;
        }
      };

      const requestRender = () => {
        if (!isRunning && isVisible) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(animateWebGL);
        }
      };

      const resizeWebGL = () => {
        if (!sectionElement || !renderer || !material) return;
        const width = sizeElement.offsetWidth;
        const height = sizeElement.offsetHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        material.uniforms.uResolution.value.set(width, height);
        requestRender();
      };

      const handleScroll = () => {
        if (!sectionElement || !isVisible) return;
        const rect = sectionElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const currentScroll = windowHeight - rect.top;
        
        if (currentScroll >= 0) {
          if (playLate) {
            const startScroll = windowHeight * 0.75;
            const endScroll = windowHeight * 0.95;
            if (currentScroll > startScroll) {
              const range = endScroll - startScroll;
              const factor = Math.min((currentScroll - startScroll) / range, 1.0);
              targetProgress = factor * 0.35;
            } else {
              targetProgress = 0;
            }
          } else {
            targetProgress = Math.min((currentScroll / windowHeight) * speed, 1.2);
          }
        } else {
          targetProgress = 0;
        }
        requestRender();
      };

      resizeWebGL();
      window.addEventListener("resize", resizeWebGL);
      window.addEventListener("scroll", handleScroll, { passive: true });

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisible = entry.isIntersecting;
          if (isVisible) {
            handleScroll();
            requestRender();
          }
        },
        { rootMargin: "150px 0px 150px 0px" }
      );

      observer.observe(sectionElement);

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        isRunning = false;
      };

      canvas.addEventListener("webglcontextlost", handleContextLost, false);

      return () => {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        observer.disconnect();
        window.removeEventListener("resize", resizeWebGL);
        window.removeEventListener("scroll", handleScroll);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    } catch (err) {
      console.warn("WebGL initialization failed for SectionShader:", err);
    }
  }, [color, spread, speed, scrollTarget, sizeTarget, playLate, invert]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas absolute inset-0 w-full h-full pointer-events-none z-5"
    />
  );
}
