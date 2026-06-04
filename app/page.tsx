import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatWeDo from "./components/WhatWeDo";
import TargetAudience from "./components/TargetAudience";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative bg-[#ffffff] text-[#0f0f0f] overflow-x-hidden selection:bg-[#FF6118]/20 selection:text-[#FF6118]">
        <Preloader />
        <Hero />
        <About />
        <WhatWeDo />
        <TargetAudience />
        <Contact />
      </div>
    </>
  );
}