"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ButtonShader, { useHoverInteraction } from "../components/ButtonShader";
import Ballpit from "../components/Ballpit";

export default function CollabPage() {
  const { isHovered: isSubmitHovered, handlers: submitHandlers } = useHoverInteraction();
  const { isHovered: isBackHovered, handlers: backHandlers } = useHoverInteraction();
  const { isHovered: isResetHovered, handlers: resetHandlers } = useHoverInteraction();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
    botcheck: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [testSimulateError, setTestSimulateError] = useState(false);

  const web3FormsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.botcheck) return; // Silent return for bot submissions

    setStatus("submitting");
    setErrorMessage("");

    // If Web3Forms access key is not set yet, or for testing purpose:
    if (!web3FormsAccessKey || web3FormsAccessKey === "YOUR_ACCESS_KEY_HERE") {
      console.log("[Test Mode] Submitting collaboration form:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (testSimulateError || formData.message.toLowerCase().includes("error")) {
        setStatus("error");
        setErrorMessage("Test Error: Unable to reach server. Please try again later.");
      } else {
        setStatus("success");
      }
      return;
    }

    // Real Web3Forms submission
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          website: formData.website,
          subject: `New Collaboration Inquiry from ${formData.name}`,
          from_name: "Mycelius Website",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      setStatus("error");
      setErrorMessage("Network error. Please check your internet connection and try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
      website: "",
      botcheck: "",
    });
    setStatus("idle");
    setErrorMessage("");
  };

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

      {/* Back Button - Absolute Top Left Corner */}
      <div className="absolute top-0 left-0 z-50 pointer-events-auto">
        <Link
          href="/"
          {...backHandlers}
          aria-label="Back to home"
          className="group relative overflow-hidden w-12 h-12 md:w-14 md:h-14 bg-transparent border-b border-r border-[#12110E] rounded-br-2xl md:rounded-br-3xl transition-all duration-300 flex items-center justify-center cursor-pointer pointer-events-auto touch-manipulation"
        >
          <ButtonShader isHovered={isBackHovered} colorB="#12110E" />
          <span className={`relative z-10 transition-colors duration-300 text-xl md:text-2xl font-medium pr-1 pb-1 ${
            isBackHovered ? 'text-white' : 'text-[#12110E]'
          }`}>
            &larr;
          </span>
        </Link>
      </div>

      {/* Testing Mode Indicator & Quick Error Simulator Toggle */}
      {!web3FormsAccessKey && (
        <div className="absolute top-4 right-6 z-50 flex items-center gap-3 bg-[#12110E]/10 backdrop-blur-md border border-[#12110E]/15 rounded-full px-4 py-1.5 text-[11px] font-avenir-next text-[#12110E]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#F15B20] animate-pulse" />
          <span className="font-semibold">Test Mode (Fake Submit)</span>
          <label className="flex items-center gap-1.5 cursor-pointer ml-2 border-l border-[#12110E]/20 pl-3">
            <input
              type="checkbox"
              checked={testSimulateError}
              onChange={(e) => setTestSimulateError(e.target.checked)}
              className="accent-[#F15B20] rounded cursor-pointer"
            />
            <span className="text-[10px] text-[#12110E]/70 select-none">Simulate Error</span>
          </label>
        </div>
      )}

      {/* Main Container mirroring the visual layout */}
      <div className="w-full max-w-[680px] bg-transparent flex flex-col justify-center h-full max-h-[92vh] py-4 relative z-20 mx-auto px-4 sm:px-0">
        
        {/* Header Block */}
        <div className={`text-center w-full flex justify-center ${status === "success" ? "mb-4 md:mb-6" : "mb-10 md:mb-14"}`}>
          <h1 className="text-2xl xs:text-3xl md:text-[2.35rem] lg:text-[2.6rem] font-normal font-ardela-edge tracking-tight uppercase text-[#12110E] text-center leading-[1.15] mb-1 whitespace-normal md:whitespace-nowrap">
            {status === "success" ? (
              <>MESSAGE <span className="text-[#F15B20]">RECEIVED</span></>
            ) : (
              <>START YOUR <span className="text-[#F15B20]">BIOSHIFT</span> JOURNEY TODAY</>
            )}
          </h1>
        </div>

        {status === "success" ? (
          /* Success Screen */
          <div className="flex flex-col items-center text-center max-w-[580px] w-full mx-auto font-avenir-next animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#F15B20] flex items-center justify-center text-[#12110E] text-3xl font-bold my-6 md:my-8 shadow-sm">
              ✓
            </div>
            
            <p className="text-xl md:text-2xl font-bold tracking-tight text-[#12110E] leading-relaxed max-w-[500px]">
              Sent. Somewhere, a mushroom just got excited (:
            </p>

            <div className="pt-8 md:pt-10">
              <button
                type="button"
                onClick={handleReset}
                {...resetHandlers}
                className="group relative h-12 px-8 rounded-full bg-[#000000] text-white text-xs md:text-sm font-sans font-medium tracking-wide flex items-center justify-between gap-3 overflow-hidden select-none transition-all duration-300 shadow-md cursor-pointer"
              >
                <ButtonShader isHovered={isResetHovered} />
                <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-black">
                  Send another message &rarr;
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Minimal Underlined Form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-7 md:gap-8 font-extralight font-avenir-next max-w-[580px] w-full mx-auto">
            
            {/* Botcheck Honeypot Field */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: "none" }}
              checked={!!formData.botcheck}
              onChange={(e) => setFormData((prev) => ({ ...prev, botcheck: e.target.checked ? "bot" : "" }))}
            />

            {/* Name */}
            <div className="flex flex-col text-left">
              <label htmlFor="name" className="text-[10px] md:text-xs font-bold font-avenir-next tracking-[0.25em] text-[#12110E] uppercase mb-1.5">
                YOUR NAME <span className="text-[#F15B20] font-normal">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                disabled={status === "submitting"}
                value={formData.name}
                onChange={handleInputChange}
                placeholder="The one who signs the emails"
                className="w-full pb-3 bg-transparent text-lg md:text-xl font-bold font-avenir-next tracking-[0.05em] text-[#000000] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300 disabled:opacity-50 pointer-events-auto touch-manipulation"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col text-left">
              <label htmlFor="email" className="text-[10px] md:text-xs font-bold font-avenir-next tracking-[0.25em] text-[#12110E] uppercase mb-1.5">
                EMAIL <span className="text-[#F15B20] font-normal">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                disabled={status === "submitting"}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Where replies go to live"
                className="w-full pb-3 bg-transparent text-lg md:text-xl font-bold font-avenir-next tracking-[0.05em] text-[#000000] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300 disabled:opacity-50 pointer-events-auto touch-manipulation"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col text-left">
              <label htmlFor="message" className="text-[10px] md:text-xs font-bold font-avenir-next tracking-[0.25em] text-[#12110E] uppercase mb-1.5">
                MESSAGE <span className="text-[#F15B20] font-normal">*</span>
              </label>
              <input
                type="text"
                id="message"
                name="message"
                required
                disabled={status === "submitting"}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us what's growing in your mind"
                className="w-full pb-3 bg-transparent text-lg md:text-xl font-bold font-avenir-next tracking-[0.05em] text-[#000000] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300 disabled:opacity-50 pointer-events-auto touch-manipulation"
              />
            </div>

            {/* Company's Website */}
            <div className="flex flex-col text-left">
              <label htmlFor="website" className="text-[10px] md:text-xs font-bold font-avenir-next tracking-[0.25em] text-[#12110E] uppercase mb-1.5">
                COMPANY WEBSITE
              </label>
              <input
                type="url"
                id="website"
                name="website"
                disabled={status === "submitting"}
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Optional, but we'll look it up anyway"
                className="w-full pb-3 bg-transparent text-lg md:text-xl font-bold font-avenir-next tracking-[0.05em] text-[#000000] border-b border-[#12110E]/20 focus:border-[#F15B20] focus:outline-none placeholder:text-[#12110E]/70 placeholder:font-extralight placeholder:font-avenir-next placeholder:tracking-[0.05em] transition-colors duration-300 disabled:opacity-50 pointer-events-auto touch-manipulation"
              />
            </div>

            {/* Error Message Box */}
            {status === "error" && (
              <div className="p-4 bg-[#DC2626] border border-red-700 text-white text-xs md:text-sm font-medium rounded-xl flex items-center justify-between gap-3 shadow-md">
                <span>{errorMessage || "An error occurred while submitting. Please try again."}</span>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="underline hover:text-white/80 font-semibold cursor-pointer shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 md:mt-10 flex justify-center">
              <button
                type="submit"
                disabled={status === "submitting"}
                {...submitHandlers}
                className="submit-button group relative h-12 px-8 rounded-full bg-[#000000] text-white text-xs md:text-sm font-sans font-medium tracking-wide flex items-center justify-between gap-3 overflow-hidden select-none transition-all duration-300 shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <ButtonShader isHovered={isSubmitHovered && status !== "submitting"} />
                <span className="relative z-10 transition-colors duration-700 group-hover:duration-200 group-hover:text-black flex items-center gap-2">
                  {status === "submitting" ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>Send message &rarr;</>
                  )}
                </span>
              </button>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}
