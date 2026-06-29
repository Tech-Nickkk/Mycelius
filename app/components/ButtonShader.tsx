"use client";

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
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
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

    // Get organic noise value (range [0.0, 0.875])
    float noiseValue = fbm(centeredUv * 2.0); // Reduced density (multiplier 2.0) for much broader, minimal organic blobs

    // Transition threshold moves from 0.0 to 1.15 based on uProgress.
    // At uProgress = 0, d is positive everywhere (ColorA).
    // At uProgress = 1.0, d is negative everywhere (ColorB).
    float threshold = uProgress * 1.15;
    float d = (noiseValue + 0.1) - threshold;

    float pixelSize = 1.0 / uResolution.y;
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
      setIsHovered(true);
    },
    onTouchEnd: () => {
      setIsHovered(false);
      setTimeout(() => {
        isTouch.current = false;
      }, 500);
    },
    onTouchCancel: () => {
      setIsHovered(false);
      setTimeout(() => {
        isTouch.current = false;
      }, 500);
    },
  };

  return { isHovered, handlers };
}

export default function ButtonShader({
  isHovered,
  colorA = "#12110E",
  colorB = "#F15B20",
  spread = 0.3,
}: ButtonShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(isHovered);

  // Sync hover state ref without tearing down WebGL context
  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    const rgbA = hexToRgb(colorA);
    const rgbB = hexToRgb(colorB);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(parent.offsetWidth, parent.offsetHeight),
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
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrameId: number;
    let targetProgress = 0;

    const animate = () => {
      if (!material || !renderer) return;

      targetProgress = hoverRef.current ? 1.25 : 0.0;
      const diff = targetProgress - material.uniforms.uProgress.value;

      if (Math.abs(diff) > 0.001) {
        material.uniforms.uProgress.value += diff * 0.02; // Moderate transition speed for responsive organic growth
        renderer.render(scene, camera);
      } else if (material.uniforms.uProgress.value !== targetProgress) {
        material.uniforms.uProgress.value = targetProgress;
        renderer.render(scene, camera);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [colorA, colorB, spread]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none rounded-full z-0"
    />
  );
}
