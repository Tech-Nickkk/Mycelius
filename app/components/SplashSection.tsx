import SplashImage from "./SplashImage";

export default function SplashSection() {
  return (
    <section 
      className="relative w-full min-h-[150vh] bg-[#ffffff] flex items-center justify-center py-32"
    >
      {/* 
        Smaller bounded container for the splash image
      */}
      <div 
        id="splash-image-container"
        className="relative w-[90vw] md:w-[60vw] h-[50vh] md:h-[70vh] max-w-5xl overflow-hidden"
      >
        <SplashImage 
          imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
          scrollTarget="#splash-image-container" 
        />
        
        {/* Centered text overlay */}
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mix-blend-difference text-white opacity-80">
          <h2 className="text-4xl md:text-[5rem] font-ppmori tracking-tight font-light leading-none text-center">
            Grown to fit.
          </h2>
          <p className="font-ppeditorial italic text-xl md:text-3xl mt-2 text-center">
            Architectural scale.
          </p>
        </div> */}
      </div>
    </section>
  );
}
