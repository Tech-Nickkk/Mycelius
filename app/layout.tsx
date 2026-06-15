import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import localFont from "next/font/local";

const suisseIntl = localFont({
  src: "./fonts/suisse.ttf",
  variable: "--font-suisse",
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

const saans = localFont({
  src: [
    {
      path: "./fonts/Saans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Saans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Saans-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Saans-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-saans",
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
    <html lang="en" className={`${suisseIntl.variable} ${neueHaasDisplay.variable} ${saans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#ffffff] text-[#12110E] antialiased font-sans selection:bg-[#FF6118]/20 selection:text-[#FF6118]" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
