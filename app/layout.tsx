import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import "./globals.css";
import localFont from "next/font/local";



const suisseIntl = localFont({
  src: [
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-LightIt.otf", weight: "300", style: "italic" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-RegularIt.otf", weight: "400", style: "italic" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-MediumIt.otf", weight: "500", style: "italic" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/suisse-font-family/SuisseIntlTrial-BoldIt.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-suisse",
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
    <html lang="en" className={`${suisseIntl.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#ffffff] text-[#0f0f0f] antialiased font-sans selection:bg-[#FF6118]/20 selection:text-[#FF6118]" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
