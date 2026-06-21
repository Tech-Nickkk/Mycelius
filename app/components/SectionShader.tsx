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
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  uniform float uInvert;
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
  playLate?: boolean;
  invert?: boolean;
}

export default function SectionShader({
  color = "#ffffff",
  spread = 0.5,
  speed = 1.0,
  scrollTarget = "#black-section",
  playLate = false,
  invert = false,
}: SectionShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sectionElement = document.querySelector(scrollTarget) as HTMLElement;
    if (!sectionElement) return;

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

    const resizeWebGL = () => {
      if (!sectionElement || !renderer || !material) return;
      const width = sectionElement.offsetWidth;
      const height = sectionElement.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(width, height);
    };

    resizeWebGL();
    window.addEventListener("resize", resizeWebGL);

    let targetProgress = 0;
    const handleScroll = () => {
      if (!sectionElement) return;
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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    let animationFrameId: number;
    let lastRenderedProgress = -1;

    const animateWebGL = () => {
      if (!material || !renderer) return;

      const diff = targetProgress - material.uniforms.uProgress.value;
      
      if (Math.abs(diff) > 0.001) {
        material.uniforms.uProgress.value += diff * 0.05;
        renderer.render(scene, camera);
        lastRenderedProgress = material.uniforms.uProgress.value;
      } 
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
  }, [color, spread, speed, scrollTarget, playLate, invert]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas absolute inset-0 w-full h-full pointer-events-none z-5"
    />
  );
}
