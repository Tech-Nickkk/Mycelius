"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    // Inverted alpha logic: start fully opaque white, dissolve to transparent to reveal black background
    float alpha = smoothstep(-pixelSize, pixelSize, d);

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
}

function SectionShader({
  color = "#ffffff",
  spread = 0.5,
  speed = 1.0,
  scrollTarget = "#black-section",
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
        targetProgress = Math.min((currentScroll / windowHeight) * speed, 1.2);
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
      
      // If the difference is meaningful, continue interpolating and rendering
      if (Math.abs(diff) > 0.001) {
        material.uniforms.uProgress.value += diff * 0.05;
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

export default function TargetAudience() {
  const stickySectionRef = useRef<HTMLElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!stickySectionRef.current || !slidesContainerRef.current || !sliderRef.current) return;

    const slides = gsap.utils.toArray(".audience-slide") as HTMLElement[];
    const stickyHeight = window.innerHeight * 7;
    const totalMove = slidesContainerRef.current.offsetWidth - sliderRef.current.offsetWidth;
    const slideWidth = sliderRef.current.offsetWidth;

    // Separate ScrollTrigger for the mushroom entry animation as the section scrolls into view
    gsap.fromTo(
      ".mushroom-left",
      {
        y: 350,
        rotation: -25,
      },
      {
        y: 0,
        rotation: 0,
        scrollTrigger: {
          trigger: stickySectionRef.current,
          start: "top center", // Starts when the top of the section enters the bottom of the viewport
          end: "bottom top", 
          // markers: true,     // Completes when the top of the section is 30% from the top of the viewport
          scrub: 1.2,
        },
      }
    );

    const wordsLeft = slidesContainerRef.current.querySelectorAll(".word-left");
    const wordsRight = slidesContainerRef.current.querySelectorAll(".word-right");

    // Main horizontal scroll timeline with pinning and scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stickySectionRef.current,
        start: "top top",
        end: `+=${stickyHeight}px`,
        scrub: 0.3, // Very responsive 100ms lag to absorb micro-jitters without lag feel
        pin: true,
        pinSpacing: true,
      }
    });

    // 1. Translate slidesContainerRef horizontally
    tl.to(slidesContainerRef.current, {
      x: -totalMove,
      ease: "none",
      duration: 1,
    }, 0);

    // 2. Animate the left-moving words
    tl.to(wordsLeft, {
      x: totalMove * 0.08,
      ease: "none",
      duration: 1,
    }, 0);

    // 3. Animate the right-moving words
    tl.to(wordsRight, {
      x: -totalMove * 0.08,
      ease: "none",
      duration: 1,
    }, 0);

    // 4. Parallax effect for each slide image
    slides.forEach((slide, index) => {
      const image = slide.querySelector("img");
      if (!image) return;

      gsap.set(image, { scale: 1.35 });

      // Determine timeline progress range for this slide's parallax
      const startProgress = Math.max(0, (index - 1) / 5);
      const endProgress = Math.min(1, (index + 1) / 5);
      const duration = endProgress - startProgress;

      if (duration > 0) {
        const startX = (index === 0) ? 0 : -slideWidth * 0.25;
        const endX = (index === 5) ? 0 : slideWidth * 0.25;

        tl.fromTo(image, 
          { x: startX },
          {
            x: endX,
            ease: "none",
            duration: duration,
          },
          startProgress
        );
      }
    });

    // 5. SVG line path drawing animation on horizontal scroll start
    if (linePathRef.current) {
      const path = linePathRef.current;
      const pathLength = path.getTotalLength();
      
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      tl.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        duration: 0.2, // draw path over the first 20% of horizontal scroll
      }, 0);
    }

  }, { scope: stickySectionRef });

  return (
    <>
      {/* Sticky Horizontal Scroll Section */}
      <section id="target-audience-scroll" ref={stickySectionRef} className="relative w-full h-screen bg-[#0f0f0f] overflow-hidden">
        <div ref={sliderRef} className="relative w-full h-full overflow-hidden">
          <div ref={slidesContainerRef} className="relative w-[600%] h-full flex will-change-transform">
            
            {/* SVG Connecting Line */}
            <svg 
              className="absolute left-[62vw] md:left-[56vw] w-[38vw] md:w-[60vw] h-[30vh] md:h-[40vh] top-[55%] md:top-[48%] pointer-events-none z-20 overflow-visible"
              viewBox="0 0 500 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrowhead"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M 1 2 L 7 5 L 1 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </marker>
              </defs>
              <path
                ref={linePathRef}
                d="M 87.543 249.701 C 95.84 233.107 105.472 217.806 115.738 202.407 C 121.626 193.574 129.119 185.096 137.566 178.76 C 224.715 113.398 242.927 263.652 296.729 285.172 C 331.696 299.158 369.959 256.977 403.14 256.977"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#arrowhead)"
              />
            </svg>

            {/* Slide 1 - Intro */}
            <div className="audience-slide relative w-1/6 shrink-0 h-full bg-[#0f0f0f] flex items-center justify-center overflow-hidden">
              <SectionShader color="#ffffff" scrollTarget="#target-audience-scroll" speed={1.13} />
              
              <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl px-8 text-white py-12">
                <div className="w-full flex flex-col items-center text-center gap-4 md:gap-8">
                  {/* Who */}
                  <div className="w-full flex justify-center word-left will-change-transform">
                    <span className="text-[12vw] md:text-[8vw] font-normal tracking-tighter leading-[0.8]">Who</span>
                  </div>
                  {/* we */}
                  <div className="w-full flex justify-center word-right will-change-transform">
                    <span className="text-[12vw] md:text-[8vw] font-normal tracking-tighter leading-[0.8]">we</span>
                  </div>
                  {/* work */}
                  <div className="w-full flex justify-center word-left will-change-transform">
                    <span className="text-[12vw] md:text-[8vw] font-normal tracking-tighter leading-[0.8]">work</span>
                  </div>
                  {/* with */}
                  <div className="w-full flex justify-center items-center gap-4 md:gap-8 word-right will-change-transform">
                    <span className="text-[12vw] md:text-[8vw] font-normal tracking-tighter leading-[0.8]">with</span>
                  </div>
                </div>
              </div>

              {/* Left Decorative Mushroom */}
              <div className="mushroom-left absolute left-[8%] md:left-[15%] top-[55%] -translate-y-1/2 w-28 h-28 md:w-44 md:h-44 pointer-events-none z-10">
                <img src="/mushroom.png" alt="Mushroom Decor" className="w-full h-full object-contain" style={{ filter: "brightness(0) invert(1)" }} />
              </div>
            </div>

            {/* Slide 2 */}
            <div className="audience-slide relative w-1/6 shrink-0 h-full flex items-center justify-center p-8">
              <div className="relative w-full md:w-[70vw] h-[65vh]">
                <div className="absolute inset-0 overflow-hidden z-10">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Interior Designers" className="relative w-full h-full object-cover will-change-transform scale-[1.35]" />
                </div>
                <div className="absolute left-0 right-0 top-full mt-4 md:mt-6 flex justify-center pointer-events-none z-20">
                  <h1 className="text-white text-[7.5vw] lg:text-[5.5vw] font-normal tracking-tight leading-[0.9] whitespace-nowrap font-ppeditorial">
                    Interior Designers
                  </h1>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="audience-slide relative w-1/6 shrink-0 h-full flex items-center justify-center p-8">
              <div className="relative w-full md:w-[70vw] h-[65vh]">
                <div className="absolute inset-0 overflow-hidden z-10">
                  <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop" alt="Architects" className="relative w-full h-full object-cover will-change-transform scale-[1.35]" />
                </div>
                <div className="absolute left-0 right-0 top-full mt-4 md:mt-6 flex justify-center pointer-events-none z-20">
                  <h1 className="text-white text-[7.5vw] lg:text-[5.5vw] font-normal tracking-tight leading-[0.9] whitespace-nowrap font-ppeditorial">
                    Architects
                  </h1>
                </div>
              </div>
            </div>

            {/* Slide 4 */}
            <div className="audience-slide relative w-1/6 shrink-0 h-full flex items-center justify-center p-8">
              <div className="relative w-full md:w-[70vw] h-[65vh]">
                <div className="absolute inset-0 overflow-hidden z-10">
                  <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop" alt="Luxury Residences" className="relative w-full h-full object-cover will-change-transform scale-[1.35]" />
                </div>
                <div className="absolute left-0 right-0 top-full mt-4 md:mt-6 flex justify-center pointer-events-none z-20">
                  <h1 className="text-white text-[7.5vw] lg:text-[5.5vw] font-normal tracking-tight leading-[0.9] whitespace-nowrap font-ppeditorial">
                    Luxury Residences
                  </h1>
                </div>
              </div>
            </div>

            {/* Slide 5 */}
            <div className="audience-slide relative w-1/6 shrink-0 h-full flex items-center justify-center p-8">
              <div className="relative w-full md:w-[70vw] h-[65vh]">
                <div className="absolute inset-0 overflow-hidden z-10">
                  <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" alt="Hospitality Spaces" className="relative w-full h-full object-cover will-change-transform scale-[1.35]" />
                </div>
                <div className="absolute left-0 right-0 top-full mt-4 md:mt-6 flex justify-center pointer-events-none z-20">
                  <h1 className="text-white text-[7.5vw] lg:text-[5.5vw] font-normal tracking-tight leading-[0.9] whitespace-nowrap font-ppeditorial">
                    Hospitality Spaces
                  </h1>
                </div>
              </div>
            </div>

            {/* Slide 6 */}
            <div className="audience-slide relative w-1/6 shrink-0 h-full flex items-center justify-center p-8">
              <div className="relative w-full md:w-[70vw] h-[65vh]">
                <div className="absolute inset-0 overflow-hidden z-10">
                  <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" alt="Sustainable Commercial Interiors" className="relative w-full h-full object-cover will-change-transform scale-[1.35]" />
                </div>
                <div className="absolute left-0 right-0 top-full mt-4 md:mt-6 flex justify-center pointer-events-none z-20">
                  <h1 className="text-white text-[7.5vw] lg:text-[5.5vw] font-normal tracking-tight leading-[0.9] whitespace-nowrap font-ppeditorial">
                    Sustainable Commercial
                  </h1>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
