"use client";

import { useEffect, useRef, ReactNode, RefObject } from "react";
import { gsap } from "gsap";

export interface PhysicsConfig {
  proximityRadius?: number;
  pushForce?: number;
  tiltAmount?: number;
  neighborInfluence?: number;
  springStiffness?: number;
  bounceFriction?: number;
  cursorSmoothing?: number;
}

export interface LayoutConfig {
  rotation?: number[];
  x?: number[];
  y?: number[];
  mobileRotation?: number[];
  mobileX?: number[];
  mobileY?: number[];
}

interface MagneticCardsProps {
  children: ReactNode[];
  parentRef?: RefObject<HTMLElement | null>;
  config?: PhysicsConfig;
  layout?: LayoutConfig;
  className?: string;
  cardsContainerClassName?: string;
}

export default function MagneticCards({
  children,
  parentRef,
  config = {},
  layout = {},
  className = "relative w-full flex-grow flex items-center justify-center h-full",
  cardsContainerClassName = "cards absolute top-[52%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
}: MagneticCardsProps) {
  const localSpotlightRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const spotlight = parentRef?.current || localSpotlightRef.current;
    const cardsContainer = cardsContainerRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!spotlight || !cardsContainer || cards.length === 0) return;

    // Physics parameters from config props with default fallbacks
    const PROXIMITY_RADIUS = config.proximityRadius ?? 500;
    const PUSH_FORCE = config.pushForce ?? 10;
    const TILT_AMOUNT = config.tiltAmount ?? 0.1;
    const NEIGHBOR_INFLUENCE = config.neighborInfluence ?? 0.2;
    const SPRING_STIFFNESS = config.springStiffness ?? 0.05;
    const BOUNCE_FRICTION = config.bounceFriction ?? 0.85;
    const CURSOR_SMOOTHING = config.cursorSmoothing ?? 0.75;

    // Responsive layout from props with default fallbacks
    const isMobile = window.innerWidth < 768;

    const currentLayout = {
      rotation: isMobile 
        ? (layout.mobileRotation ?? [-4, 3, -6]) 
        : (layout.rotation ?? [-5, 5, -8]),
      x: isMobile 
        ? (layout.mobileX ?? [0, 0, 0]) 
        : (layout.x ?? [-350, 0, 350]),
      y: isMobile 
        ? (layout.mobileY ?? [-260, 0, 260]) 
        : (layout.y ?? [-10, 15, -5]),
    };

    const cursor = { x: 0, y: 0, vx: 0, vy: 0 };
    let prevCursorX = 0;
    let prevCursorY = 0;

    const cardPhysics = cards.map((el, i) => {
      const initX = currentLayout.x[i] || 0;
      const initY = currentLayout.y[i] || 0;
      const initR = currentLayout.rotation[i] || 0;

      gsap.set(el, {
        x: initX,
        y: initY,
        rotation: initR,
        zIndex: i,
        xPercent: -50,
        yPercent: -50,
      });

      return {
        el,
        restX: initX,
        restY: initY,
        restR: initR,
        x: initX,
        y: initY,
        r: initR,
        vx: 0,
        vy: 0,
        vr: 0,
      };
    });

    let rect = spotlight.getBoundingClientRect();
    const updateRect = () => {
      if (spotlight) {
        rect = spotlight.getBoundingClientRect();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX - rect.left - rect.width / 2;
      cursor.y = e.clientY - rect.top - rect.height / 2;
      cursor.vx = (cursor.x - prevCursorX) * CURSOR_SMOOTHING;
      cursor.vy = (cursor.y - prevCursorY) * CURSOR_SMOOTHING;
      prevCursorX = cursor.x;
      prevCursorY = cursor.y;
    };

    const handleMouseLeave = () => {
      cursor.vx = 0;
      cursor.vy = 0;
      cursor.x = 999999;
      cursor.y = 999999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    spotlight.addEventListener("mouseleave", handleMouseLeave);

    // Track touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      updateRect();
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      prevCursorX = clientX - rect.left - rect.width / 2;
      prevCursorY = clientY - rect.top - rect.height / 2;
      cursor.x = prevCursorX;
      cursor.y = prevCursorY;
      cursor.vx = 0;
      cursor.vy = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      cursor.x = clientX - rect.left - rect.width / 2;
      cursor.y = clientY - rect.top - rect.height / 2;
      cursor.vx = (cursor.x - prevCursorX) * CURSOR_SMOOTHING;
      cursor.vy = (cursor.y - prevCursorY) * CURSOR_SMOOTHING;
      prevCursorX = cursor.x;
      prevCursorY = cursor.y;
    };

    const handleTouchEnd = () => {
      cursor.vx = 0;
      cursor.vy = 0;
      cursor.x = 999999;
      cursor.y = 999999;
    };

    spotlight.addEventListener("touchstart", handleTouchStart, { passive: true });
    spotlight.addEventListener("touchmove", handleTouchMove, { passive: true });
    spotlight.addEventListener("touchend", handleTouchEnd, { passive: true });
    spotlight.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    function calculatePushForce(card: typeof cardPhysics[0]) {
      const speed = Math.sqrt(cursor.vx ** 2 + cursor.vy ** 2);
      if (speed < 0.5) return { fx: 0, fy: 0 };

      // Calculate relative distance between cursor and card current position
      const dist = Math.sqrt((cursor.x - card.x) ** 2 + (cursor.y - card.y) ** 2);

      if (dist > PROXIMITY_RADIUS) return { fx: 0, fy: 0 };

      const weight = Math.pow(1 - dist / PROXIMITY_RADIUS, 3);
      return {
        fx: cursor.vx * PUSH_FORCE * weight,
        fy: cursor.vy * PUSH_FORCE * weight,
      };
    }

    function applyNeighborInfluence(forces: { fx: number; fy: number }[], index: number) {
      let fx = forces[index].fx;
      let fy = forces[index].fy;

      forces.forEach((f, j) => {
        if (j === index) return;
        const falloff = Math.pow(NEIGHBOR_INFLUENCE, Math.abs(j - index));
        fx += f.fx * falloff;
        fy += f.fy * falloff * 0.6;
      });

      return { fx, fy };
    }

    // Connect to GSAP ticker
    const tickHandler = () => {
      const forces = cardPhysics.map(calculatePushForce);

      cardPhysics.forEach((card, i) => {
        const { fx, fy } = applyNeighborInfluence(forces, i);

        card.vx = (card.vx + (card.restX + fx - card.x) * SPRING_STIFFNESS) * BOUNCE_FRICTION;
        card.vy = (card.vy + (card.restY + fy - card.y) * SPRING_STIFFNESS) * BOUNCE_FRICTION;
        card.vr = (card.vr + (card.restR + fx * TILT_AMOUNT - card.r) * SPRING_STIFFNESS) * BOUNCE_FRICTION;

        card.x += card.vx;
        card.y += card.vy;
        card.r += card.vr;

        gsap.set(card.el, { x: card.x, y: card.y, rotation: card.r });
      });
    };

    gsap.ticker.add(tickHandler);

    // Handle screen resize
    const handleResize = () => {
      updateRect();
      const isMobileNow = window.innerWidth < 768;
      const layoutX = isMobileNow 
        ? (layout.mobileX ?? [0, 0, 0]) 
        : (layout.x ?? [-350, 0, 350]);
      const layoutY = isMobileNow 
        ? (layout.mobileY ?? [-260, 0, 260]) 
        : (layout.y ?? [-10, 15, -5]);
      const layoutR = isMobileNow 
        ? (layout.mobileRotation ?? [-4, 3, -6]) 
        : (layout.rotation ?? [-5, 5, -8]);

      cardPhysics.forEach((card, i) => {
        card.restX = layoutX[i] || 0;
        card.restY = layoutY[i] || 0;
        card.restR = layoutR[i] || 0;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      spotlight.removeEventListener("mouseleave", handleMouseLeave);
      spotlight.removeEventListener("touchstart", handleTouchStart);
      spotlight.removeEventListener("touchmove", handleTouchMove);
      spotlight.removeEventListener("touchend", handleTouchEnd);
      spotlight.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(tickHandler);
    };
  }, [parentRef, config, layout]);

  return (
    <div ref={localSpotlightRef} className={className}>
      <div ref={cardsContainerRef} className={cardsContainerClassName}>
        {children.map((child, idx) => (
          <div
            key={idx}
            ref={(el) => {
              if (el) cardsRef.current[idx] = el;
            }}
            className="absolute pointer-events-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
