import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { Syne, Outfit, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

const ppMori = localFont({
  src: "./fonts/PPMori.otf",
  variable: "--font-ppmori",
});

const ppEditorial = localFont({
  src: [
    {
      path: "./fonts/PPEditorial.otf",
    },
    {
      path: "./fonts/PPEditorialItalic.otf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-ppeditorial",
});

export const metadata: Metadata = {
  title: "Mycelius App",
  description: "Next.js, Tailwind v4, GSAP, and Lenis Scroll setup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} ${instrument.variable} ${ppMori.variable} ${ppEditorial.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#ffffff] text-[#0f0f0f] antialiased font-sans selection:bg-[#FF6118]/20 selection:text-[#FF6118]" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
