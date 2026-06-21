"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ButtonShader from "../components/ButtonShader";
import { Engine, Render, Runner, Bodies, Composite, Body } from "matter-js";

export default function CollabPage() {
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isBackHovered, setIsBackHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting collaboration form:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Matter.js Physics Animation on Collab Page
  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    // Preload mushroom sprite image
    const img = new Image();
    img.src = "/mushroom.png";

    const parent = containerRef.current;
    const canvas = canvasRef.current;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    // Create physics engine
    const engine = Engine.create({
      gravity: { y: 0.7 }, // Elegant falling speed
    });
    const world = engine.world;

    // Create renderer
    const render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: width,
        height: height,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false,
      },
    });

    Render.run(render);

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Setup thick boundaries (to prevent clipping at high speeds)
    const slopeAngle = 0; 
    const floorLeft = Bodies.rectangle(
      width / 4,
      height + 150,
      width / 2 + 100,
      300,
      {
        isStatic: true,
        angle: slopeAngle,
        friction: 0.001,
        render: { visible: false }
      }
    );
    const floorRight = Bodies.rectangle(
      (width * 3) / 4,
      height + 150,
      width / 2 + 100,
      300,
      {
        isStatic: true,
        angle: -slopeAngle,
        friction: 0.001,
        render: { visible: false }
      }
    );
    const leftWall = Bodies.rectangle(
      -150,
      height / 2,
      300,
      height * 3,
      { isStatic: true, render: { visible: false } }
    );
    const rightWall = Bodies.rectangle(
      width + 150,
      height / 2,
      300,
      height * 3,
      { isStatic: true, render: { visible: false } }
    );

    Composite.add(world, [floorLeft, floorRight, leftWall, rightWall]);

    // Create cursor body (invisible force field)
    const cursorRadius = 45;
    const cursorBody = Bodies.circle(
      -9999,
      -9999,
      cursorRadius,
      {
        isStatic: true,
        render: { visible: false },
      }
    );
    Composite.add(world, cursorBody);

    // Create static body for the Send Message button so mushrooms don't go through it
    const submitBtn = parent.querySelector(".submit-button") as HTMLElement;
    
    const getButtonBodyProps = () => {
      if (!submitBtn) return null;
      const parentRect = parent.getBoundingClientRect();
      const btnRect = submitBtn.getBoundingClientRect();
      
      const x = btnRect.left - parentRect.left + btnRect.width / 2;
      const y = btnRect.top - parentRect.top + btnRect.height / 2;
      return { x, y, width: btnRect.width, height: btnRect.height };
    };

    const buttonProps = getButtonBodyProps();
    let buttonBody: Matter.Body | null = null;
    
    if (buttonProps) {
      buttonBody = Bodies.rectangle(
        buttonProps.x,
        buttonProps.y,
        buttonProps.width,
        buttonProps.height,
        {
          isStatic: true,
          chamfer: { radius: buttonProps.height / 2 },
          render: { visible: false }
        }
      );
      Composite.add(world, buttonBody);
    }

    // Set a delayed update to settle the position once fonts and layout are fully ready
    const settleTimeout = setTimeout(() => {
      if (buttonBody && submitBtn) {
        const props = getButtonBodyProps();
        if (props) {
          Body.setPosition(buttonBody, { x: props.x, y: props.y });
        }
      }
    }, 600);

    // Spawning function
    let spawned = false;
    const spawnMushrooms = () => {
      if (spawned) return;
      spawned = true;

      const count = 10; 
      const mushrooms: Matter.Body[] = [];

      for (let i = 0; i < count; i++) {
        const radius = 65;
        const overlapFactor = 1.12;
        const scale = ((radius * 2) / 896) * overlapFactor;

        const x = Math.random() * (width - 200) + 100;
        const y = -150 - Math.random() * 500; // staggered spawn heights

        const mushroom = Bodies.circle(x, y, radius, {
          restitution: 0.45,
          friction: 0.001,
          frictionStatic: 0,
          frictionAir: 0.02,
          density: 0.001,
          render: {
            sprite: {
              texture: "/mushroom.png",
              xScale: scale,
              yScale: scale,
            },
          },
        });

        Body.setAngularVelocity(mushroom, (Math.random() - 0.5) * 0.15);
        Body.setVelocity(mushroom, {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 2,
        });

        mushrooms.push(mushroom);
      }

      Composite.add(world, mushrooms);
    };

    // Trigger spawn immediately on page mount
    spawnMushrooms();

    // Mouse/Touch Interaction
    let lastMousePos = { x: -9999, y: -9999 };

    const updateCursorPosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      if (lastMousePos.x !== -9999) {
        const vx = mouseX - lastMousePos.x;
        const vy = mouseY - lastMousePos.y;
        
        const speed = Math.sqrt(vx * vx + vy * vy);
        const maxSpeed = 5; 
        let finalVx = vx;
        let finalVy = vy;
        if (speed > maxSpeed) {
          finalVx = (vx / speed) * maxSpeed;
          finalVy = (vy / speed) * maxSpeed;
        }
        Body.setVelocity(cursorBody, { x: finalVx, y: finalVy });
      }

      Body.setPosition(cursorBody, { x: mouseX, y: mouseY });
      lastMousePos = { x: mouseX, y: mouseY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      Body.setPosition(cursorBody, { x: -9999, y: -9999 });
      Body.setVelocity(cursorBody, { x: 0, y: 0 });
      lastMousePos = { x: -9999, y: -9999 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      updateCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    parent.addEventListener("touchmove", handleTouchMove, { passive: true });
    parent.addEventListener("touchend", handleMouseLeave);

    // Handle screen resize
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      render.canvas.width = newWidth;
      render.canvas.height = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;

      Body.setPosition(floorLeft, { x: newWidth / 4, y: newHeight + 150 });
      Body.setPosition(floorRight, { x: (newWidth * 3) / 4, y: newHeight + 150 });
      Body.setPosition(leftWall, { x: -150, y: newHeight / 2 });
      Body.setPosition(rightWall, { x: newWidth + 150, y: newHeight / 2 });

      if (buttonBody && submitBtn) {
        setTimeout(() => {
          const props = getButtonBodyProps();
          if (props && buttonBody) {
            Body.setPosition(buttonBody, { x: props.x, y: props.y });
          }
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup physics on unmount
    return () => {
      clearTimeout(settleTimeout);
      window.removeEventListener("resize", handleResize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("touchmove", handleTouchMove);
      parent.removeEventListener("touchend", handleMouseLeave);

      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);

  return (
    <main 
      ref={containerRef}
      className="h-screen w-screen bg-[#F6F6F6] text-[#12110E] flex flex-col items-center justify-center font-suisse px-6 md:px-12 py-4 selection:bg-[#FF6118] selection:text-black overflow-hidden relative"
    >
      {/* Physics Canvas for falling mushrooms */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Back Button - Absolute Top Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <Link
          href="/"
          onMouseEnter={() => setIsBackHovered(true)}
          onMouseLeave={() => setIsBackHovered(false)}
          className="group relative overflow-hidden font-suisse text-[10px] md:text-xs uppercase tracking-widest px-4 py-2 border border-[#12110E] text-[#12110E] rounded-full transition-all duration-300 flex items-center justify-center font-medium"
        >
          <ButtonShader isHovered={isBackHovered} colorA="#ffffff" colorB="#12110E" />
          <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-white">
            &larr; Back
          </span>
        </Link>
      </div>

      {/* Main Container mirroring the visual layout */}
      <div className="w-full max-w-[580px] bg-transparent flex flex-col justify-center h-full max-h-[92vh] py-4 relative z-20">
        
        {/* Header Block */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-[2.6rem] font-medium tracking-tight font-suisse text-[#12110E] leading-[1.15] mb-3">
            Start your <span className="text-[#F15B20]">Bioshift</span> journey today
          </h1>
        </div>

        {/* Minimal Underlined Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-7 font-suisse font-normal">
          
          {/* Name */}
          <div className="flex flex-col">
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name*"
              className="w-full pb-3 bg-transparent text-xl md:text-2xl font-normal text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/40 transition-colors duration-300"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email*"
              className="w-full pb-3 bg-transparent text-xl md:text-2xl font-normal text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/40 transition-colors duration-300"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <input
              type="text"
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message*"
              className="w-full pb-3 bg-transparent text-xl md:text-2xl font-normal text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/40 transition-colors duration-300"
            />
          </div>

          {/* Company's Website */}
          <div className="flex flex-col">
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Company website"
              className="w-full pb-3 bg-transparent text-xl md:text-2xl font-normal text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/40 transition-colors duration-300"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              onMouseEnter={() => setIsSubmitHovered(true)}
              onMouseLeave={() => setIsSubmitHovered(false)}
              className="submit-button group relative h-12 px-8 rounded-full bg-[#000000] text-white font-suisse text-xs md:text-sm font-semibold tracking-wide flex items-center justify-between gap-3 overflow-hidden select-none transition-all duration-300 shadow-md cursor-pointer"
            >
              <ButtonShader isHovered={isSubmitHovered} />
              <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-black">
                Send message &rarr;
              </span>
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
