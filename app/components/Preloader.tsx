"use client";

export default function Preloader() {
  return (
    <div className="loader fixed inset-0 w-screen h-svh overflow-hidden z-[100] pointer-events-none">
      {/* Dark overlay blocks */}
      <div className="overlay absolute top-0 w-full h-full flex">
        <div className="block w-full h-full bg-[#1a1a1a] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"></div>
        <div className="block w-full h-full bg-[#1a1a1a] [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"></div>
      </div>

      {/* Intro logo words */}
      <div className="intro-logo absolute top-1/2 left-1/2 translate-x-[-60%] -translate-y-1/2 flex font-ppeditorial font-medium italic z-[102]">
        <div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)] relative" id="word-1">
          <h1 className="text-[2.5rem] max-[900px]:text-[2rem] text-white font-medium leading-none translate-y-[-120%]">
            Myce
          </h1>
        </div>
        <div className="word [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]" id="word-2">
          <h1 className="text-[2.5rem] max-[900px]:text-[2rem] text-white leading-none translate-y-[120%]">
            lius
          </h1>
        </div>
      </div>

      {/* Divider line */}
      <div className="divider absolute top-0 left-1/2 -translate-x-1/2 scale-y-0 origin-top w-px h-full bg-white/20 z-[101]"></div>
    </div>
  );
}
