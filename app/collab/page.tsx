"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ButtonShader, { useHoverInteraction } from "../components/ButtonShader";
// import { Engine, Render, Runner, Bodies, Composite, Body } from "matter-js";
// import Ferrofluid from "../components/Ferrofluid";
import Ballpit from "../components/Ballpit";

export default function CollabPage() {
  const { isHovered: isSubmitHovered, handlers: submitHandlers } = useHoverInteraction();
  const { isHovered: isBackHovered, handlers: backHandlers } = useHoverInteraction();
  // const canvasRef = useRef<HTMLCanvasElement>(null);
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

  /*
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
    const isMobile = width < 768;
    const cursorRadius = isMobile ? 25 : 45;
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

      const isMobile = width < 768;
      const count = 12; 
      const radius = isMobile ? 32 : 65;
      const mushrooms: Matter.Body[] = [];

      for (let i = 0; i < count + 1; i++) {
        const isTiny = i === count;
        const currentRadius = isTiny ? (isMobile ? 12 : 24) : radius;
        const overlapFactor = 1.12;
        const scale = ((currentRadius * 2) / 896) * overlapFactor;

        const x = Math.random() * (width - 2 * currentRadius) + currentRadius;
        const y = -150 - Math.random() * 500; // staggered spawn heights

        const mushroom = Bodies.circle(x, y, currentRadius, {
          restitution: isTiny ? 0.65 : 0.45, // slightly more bouncy for the cute tiny one
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

        Body.setAngularVelocity(mushroom, (Math.random() - 0.5) * (isTiny ? 0.35 : 0.15)); // spins faster since it's smaller
        Body.setVelocity(mushroom, {
          x: (Math.random() - 0.5) * (isTiny ? 6 : 4), // slightly faster horizontal speed for the tiny one
          y: Math.random() * (isTiny ? 3 : 2),
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
  */

  return (
    <main 
      ref={containerRef}
      className="h-screen w-screen bg-[#F6F6F6] text-[#12110E] flex flex-col items-center justify-center px-6 md:px-12 py-4 selection:bg-[#FF6118] selection:text-black overflow-hidden relative"
    >
      {/* Ballpit Background from React Bits */}
      <Ballpit
        className="fixed inset-0 w-screen h-screen z-0 opacity-40 pointer-events-none"
        count={65}
        gravity={0.01}
        friction={0.9975}
        wallBounce={0.95}
        followCursor={false}
        colors={[0xff6118, 0x12110e, 0xffffff, 0xf15b20]}
      />

      {/* WebGL Ferrofluid background (Commented Out)
      <Ferrofluid
        className="fixed inset-0 w-screen h-screen pointer-events-none z-0 opacity-25"
        colors={["#FF6118", "#12110E", "#F15B20"]}
        speed={0.12}
        scale={1.3}
        turbulence={0.7}
        fluidity={0.15}
        rimWidth={0.25}
        sharpness={2.2}
        shimmer={0.7}
        glow={1.6}
        flowDirection="down"
        opacity={0.8}
        mouseInteraction={true}
        mouseStrength={0.8}
        mouseRadius={0.3}
        mouseDampening={0.15}
      />
      */}

      {/* Physics Canvas for falling mushrooms (Commented Out)
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
      */}

      {/* Back Button - Absolute Top Left Corner */}
      <div className="absolute top-0 left-0 z-50">
        <Link
          href="/"
          {...backHandlers}
          className="group relative overflow-hidden w-12 h-12 md:w-14 md:h-14 bg-transparent border-b border-r border-[#12110E] rounded-br-2xl md:rounded-br-3xl transition-all duration-300 flex items-center justify-center"
        >
          <ButtonShader isHovered={isBackHovered} colorB="#12110E" />
          <span className={`relative z-10 transition-colors duration-300 text-xl md:text-2xl font-medium pr-1 pb-1 ${
            isBackHovered ? 'text-white' : 'text-[#12110E]'
          }`}>
            &larr;
          </span>
        </Link>
      </div>

      {/* Main Container mirroring the visual layout */}
      <div className="w-full max-w-[680px] bg-transparent flex flex-col justify-center h-full max-h-[92vh] py-4 relative z-20 mx-auto px-4 sm:px-0">
        
        {/* Header Block */}
        <div className="text-center mb-12 md:mb-16 w-full flex justify-center">
          <h1 className="text-2xl xs:text-3xl md:text-[2.35rem] lg:text-[2.6rem] font-normal font-ardela-edge tracking-tight uppercase text-[#12110E] text-center leading-[1.15] mb-1 whitespace-normal md:whitespace-nowrap">
            START YOUR <span className="text-[#F15B20]">BIOSHIFT</span> JOURNEY TODAY
          </h1>
        </div>

        {/* Minimal Underlined Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-7 md:gap-8 font-extralight font-avenir-next max-w-[580px] w-full mx-auto">
          
          {/* Name */}
          <div className="flex flex-col text-left">
            <label htmlFor="name" className="text-[10px] md:text-xs font-extralight font-avenir-next tracking-[0.25em] text-[#12110E]/75 uppercase mb-1.5">
              YOUR NAME <span className="text-[#F15B20] font-normal">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="The one who signs the emails"
              className="w-full pb-3 bg-transparent text-lg md:text-xl font-extralight font-avenir-next tracking-[0.05em] text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col text-left">
            <label htmlFor="email" className="text-[10px] md:text-xs font-extralight font-avenir-next tracking-[0.25em] text-[#12110E]/75 uppercase mb-1.5">
              EMAIL <span className="text-[#F15B20] font-normal">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Where replies go to live"
              className="w-full pb-3 bg-transparent text-lg md:text-xl font-extralight font-avenir-next tracking-[0.05em] text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col text-left">
            <label htmlFor="message" className="text-[10px] md:text-xs font-extralight font-avenir-next tracking-[0.25em] text-[#12110E]/75 uppercase mb-1.5">
              MESSAGE <span className="text-[#F15B20] font-normal">*</span>
            </label>
            <input
              type="text"
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Tell us what's growing in your mind"
              className="w-full pb-3 bg-transparent text-lg md:text-xl font-extralight font-avenir-next tracking-[0.05em] text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300"
            />
          </div>

          {/* Company's Website */}
          <div className="flex flex-col text-left">
            <label htmlFor="website" className="text-[10px] md:text-xs font-extralight font-avenir-next tracking-[0.25em] text-[#12110E]/75 uppercase mb-1.5">
              COMPANY WEBSITE
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Optional, but we'll look it up anyway"
              className="w-full pb-3 bg-transparent text-lg md:text-xl font-extralight font-avenir-next tracking-[0.05em] text-[#12110E] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 md:mt-10 flex justify-center">
            <button
              type="submit"
              {...submitHandlers}
              className="submit-button group relative h-12 px-8 rounded-full bg-[#000000] text-white text-xs md:text-sm font-extralight font-avenir-next tracking-[0.15em] flex items-center justify-between gap-3 overflow-hidden select-none transition-all duration-300 shadow-md cursor-pointer"
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
