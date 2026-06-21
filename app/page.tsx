import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import WhatWeDo from "./components/WhatWeDo";
import TargetAudience from "./components/TargetAudience";
import ProductAdvantage from "./components/ProductAdvantage";
import Collaborations from "./components/Collaborations";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="main-content-container relative bg-[#ffffff] text-[#12110E] overflow-x-hidden selection:bg-[#FF6118] selection:text-black">
        <Preloader />
        <Hero />
        <About />
        <WhatWeDo />
        <div className="bg-[#12110E]">
          <TargetAudience />
          <ProductAdvantage />
          <Collaborations />
          <Contact />
        </div>
      </div>
    </>
  );
}