import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import PageTransition from "./components/PageTransition";
import localFont from "next/font/local";
import { Bricolage_Grotesque } from "next/font/google";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const neueHaasDisplay = localFont({
  src: [
    {
      path: "./fonts/NeueHaasDisplayLight.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/NeueHaasDisplayMediu.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeueHaasDisplayBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-neue-haas",
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
    <html lang="en" className={`${bricolageGrotesque.variable} ${neueHaasDisplay.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#ffffff] text-[#12110E] antialiased selection:bg-[#FF6118] selection:text-black" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
        <PageTransition />
      </body>
    </html>
  );
}
