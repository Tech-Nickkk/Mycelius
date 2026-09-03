"use client";

/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */

import { useRef, useEffect, useState } from "react";
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
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uSpread;
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
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

    // Get organic noise value (range [0.0, 0.875])
    float noiseValue = fbm(centeredUv * 2.0);

    // Transition threshold moves from 0.0 to 1.15 based on uProgress.
    float threshold = uProgress * 1.15;
    float d = (noiseValue + 0.1) - threshold;

    float pixelSize = 1.0 / max(uResolution.y, 1.0);
    float alpha = smoothstep(-pixelSize * 1.5, pixelSize * 1.5, d);

    gl_FragColor = vec4(uColorB, 1.0 - alpha);
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
    : { r: 0.07, g: 0.07, b: 0.05 };
}

interface ButtonShaderProps {
  isHovered: boolean;
  colorA?: string;
  colorB?: string;
  spread?: number;
}

const checkTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
};

export function useHoverInteraction() {
  const [isHovered, setIsHovered] = useState(false);
  const isTouch = useRef(false);

  const handlers = {
    onMouseEnter: () => {
      if (!isTouch.current) setIsHovered(true);
    },
    onMouseLeave: () => {
      if (!isTouch.current) setIsHovered(false);
    },
    onTouchStart: () => {
      isTouch.current = true;
    },
    onTouchEnd: () => {
      setIsHovered(false);
      setTimeout(() => {
        isTouch.current = false;
      }, 300);
    },
    onTouchCancel: () => {
      setIsHovered(false);
      setTimeout(() => {
        isTouch.current = false;
      }, 300);
    },
    onBlur: () => {
      setIsHovered(false);
    },
  };

  return { isHovered, handlers, reset: () => setIsHovered(false) };
}

export default function ButtonShader({
  isHovered,
  colorA = "#12110E",
  colorB = "#F15B20",
  spread = 0.3,
}: ButtonShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(isHovered);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    setIsTouchDevice(checkTouchDevice());
  }, []);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let renderer: THREE.WebGLRenderer;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.BufferGeometry;
    let animationFrameId: number | null = null;
    let isRunning = false;

    try {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });

      const rgbA = hexToRgb(colorA);
      const rgbB = hexToRgb(colorB);
      geometry = new THREE.PlaneGeometry(2, 2);

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uProgress: { value: hoverRef.current ? 1.25 : 0 },
          uResolution: {
            value: new THREE.Vector2(
              Math.max(parent.offsetWidth, 40),
              Math.max(parent.offsetHeight, 40)
            ),
          },
          uColorA: { value: new THREE.Vector3(rgbA.r, rgbA.g, rgbA.b) },
          uColorB: { value: new THREE.Vector3(rgbB.r, rgbB.g, rgbB.b) },
          uSpread: { value: spread },
        },
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const resize = () => {
        if (!parent || !renderer || !material) return;
        const width = Math.max(parent.offsetWidth, 32);
        const height = Math.max(parent.offsetHeight, 32);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        material.uniforms.uResolution.value.set(width, height);
        if (!isRunning) {
          renderer.render(scene, camera);
        }
      };

      resize();

      const resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(parent);
      window.addEventListener("resize", resize);

      const startAnimationLoop = () => {
        if (isRunning) return;
        isRunning = true;

        const loop = () => {
          if (!material || !renderer) {
            isRunning = false;
            return;
          }

          const targetProgress = hoverRef.current ? 1.25 : 0.0;
          const diff = targetProgress - material.uniforms.uProgress.value;

          if (Math.abs(diff) > 0.002) {
            material.uniforms.uProgress.value += diff * 0.04;
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(loop);
          } else {
            material.uniforms.uProgress.value = targetProgress;
            renderer.render(scene, camera);
            isRunning = false;
            animationFrameId = null;
          }
        };

        loop();
      };

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        isRunning = false;
      };

      canvas.addEventListener("webglcontextlost", handleContextLost, false);

      renderer.render(scene, camera);

      const checkInterval = setInterval(() => {
        const target = hoverRef.current ? 1.25 : 0.0;
        if (material && Math.abs(target - material.uniforms.uProgress.value) > 0.002) {
          startAnimationLoop();
        }
      }, 40);

      return () => {
        clearInterval(checkInterval);
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    } catch (e) {
      console.warn("WebGL initialization failed for ButtonShader, falling back to CSS:", e);
      setWebglAvailable(false);
    }
  }, [colorA, colorB, spread, isTouchDevice]);

  if (isTouchDevice || !webglAvailable) {
    return (
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-300 rounded-[inherit] z-0"
        style={{
          backgroundColor: colorB,
          opacity: isHovered ? 1 : 0,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit] z-0"
    />
  );
}
