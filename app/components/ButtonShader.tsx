"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from "react";

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash(px: number, py: number): number {
  const kx = 0.3183099;
  const ky = 0.3678794;
  const x = px * kx + py;
  const y = py * ky + px;
  return fract(16.0 * Math.sin(x * y * (x + y)));
}

function noise(px: number, py: number): number {
  const ix = Math.floor(px);
  const iy = Math.floor(py);
  const fx = px - ix;
  const fy = py - iy;
  const sx = fx * fx * (3.0 - 2.0 * fx);
  const sy = fy * fy * (3.0 - 2.0 * fy);

  const h00 = hash(ix, iy);
  const h10 = hash(ix + 1, iy);
  const h01 = hash(ix, iy + 1);
  const h11 = hash(ix + 1, iy + 1);

  const nx0 = h00 + (h10 - h00) * sx;
  const nx1 = h01 + (h11 - h01) * sx;
  return nx0 + (nx1 - nx0) * sy;
}

function fbm(px: number, py: number): number {
  let v = 0.0;
  v += noise(px * 1.0, py * 1.0) * 0.5;
  v += noise(px * 2.0, py * 2.0) * 0.25;
  v += noise(px * 4.0, py * 4.0) * 0.125;
  return v;
}

function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

interface ButtonShaderProps {
  isHovered: boolean;
  colorA?: string;
  colorB?: string;
  spread?: number;
}

let isTouchCached: boolean | null = null;
const checkTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  if (isTouchCached !== null) return isTouchCached;
  isTouchCached = (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches
  );
  return isTouchCached;
};

const subscribeSync = () => () => {};
const getTouchSnapshot = () => checkTouchDevice();
const getTouchServerSnapshot = () => false;

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
  colorB = "#F15B20",
}: ButtonShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverRef = useRef(isHovered);
  const isTouchDevice = useSyncExternalStore(subscribeSync, getTouchSnapshot, getTouchServerSnapshot);

  useEffect(() => {
    hoverRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const rgbB = hexToRgb(colorB);
    const { r: rB, g: gB, b: bB } = rgbB;

    let animId: number | null = null;
    let currentProgress = hoverRef.current ? 1.25 : 0.0;
    let isRunning = false;

    const bufferWidth = 84;
    const bufferHeight = 36;
    canvas.width = bufferWidth;
    canvas.height = bufferHeight;

    const imgData = ctx.createImageData(bufferWidth, bufferHeight);
    const data = imgData.data;

    // Precalculate noise grid for this aspect ratio
    const aspect = bufferWidth / bufferHeight;
    const noiseGrid = new Float32Array(bufferWidth * bufferHeight);

    for (let y = 0; y < bufferHeight; y++) {
      const uvY = 1.0 - y / bufferHeight; // Match WebGL UV orientation
      const centeredY = uvY - 0.5;
      for (let x = 0; x < bufferWidth; x++) {
        const uvX = x / bufferWidth;
        const centeredX = (uvX - 0.5) * aspect;
        noiseGrid[y * bufferWidth + x] = fbm(centeredX * 2.0, centeredY * 2.0);
      }
    }

    const render = (progress: number) => {
      if (progress <= 0.001) {
        ctx.clearRect(0, 0, bufferWidth, bufferHeight);
        return;
      }

      if (progress >= 1.2) {
        ctx.fillStyle = colorB;
        ctx.fillRect(0, 0, bufferWidth, bufferHeight);
        return;
      }

      const threshold = progress * 1.15;
      const pixelSize = 1.0 / bufferHeight;
      const smoothRange = pixelSize * 1.5;

      for (let i = 0; i < noiseGrid.length; i++) {
        const noiseValue = noiseGrid[i];
        const d = (noiseValue + 0.1) - threshold;
        const alpha = smoothstep(-smoothRange, smoothRange, d);
        const invAlpha = 1.0 - alpha;

        const idx = i * 4;
        data[idx] = rB;
        data[idx + 1] = gB;
        data[idx + 2] = bB;
        data[idx + 3] = Math.round(invAlpha * 255);
      }

      ctx.putImageData(imgData, 0, 0);
    };

    // Initial render
    render(currentProgress);

    const loop = () => {
      const target = hoverRef.current ? 1.25 : 0.0;
      const diff = target - currentProgress;

      if (Math.abs(diff) > 0.002) {
        currentProgress += diff * 0.06;
        render(currentProgress);
        animId = requestAnimationFrame(loop);
      } else {
        currentProgress = target;
        render(currentProgress);
        isRunning = false;
        animId = null;
      }
    };

    const checkInterval = setInterval(() => {
      const target = hoverRef.current ? 1.25 : 0.0;
      if (Math.abs(target - currentProgress) > 0.002 && !isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(loop);
      }
    }, 30);

    return () => {
      clearInterval(checkInterval);
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [colorB, isTouchDevice]);

  if (isTouchDevice) {
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
      style={{ imageRendering: "auto" }}
    />
  );
}
