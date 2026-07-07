import type { Metadata } from "next";
import type { Viewport } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mycelius.com";

export const metadata: Metadata = {
  // ── Base URL for all relative OG/Twitter image paths ──
  metadataBase: new URL(siteUrl),

  // ── Title ──
  title: {
    default: "Mycelius — Biomaterials Grown from Fungi",
    template: "%s | Mycelius",
  },

  // ── Description ──
  description:
    "Mycelius grows premium biomaterials from mycelium and agricultural waste. Biodegradable, fire-retardant, non-toxic — designed without compromise for architects, interior designers, and luxury spaces.",

  // ── Keywords ──
  keywords: [
    "Mycelius",
    "biomaterials",
    "mycelium",
    "sustainable materials",
    "mushroom packaging",
    "biodegradable",
    "fire retardant",
    "non-toxic materials",
    "biodesign",
    "green architecture",
    "sustainable interior design",
    "made in India",
  ],

  // ── Author & Creator ──
  authors: [{ name: "Mycelius" }],
  creator: "Mycelius",
  publisher: "Mycelius",

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ──
  icons: {
    icon: "/logo.avif",
    apple: "/logo.avif",
  },

  // ── Open Graph ──
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Mycelius",
    title: "Mycelius — Biomaterials Grown from Fungi",
    description:
      "We grow biomaterials that deliver aesthetics, performance and responsibility. Building a new material culture from fungi and agricultural waste.",
    images: [
      {
        url: "/mycelius-gemini-Photoroom.png",
        width: 1200,
        height: 630,
        alt: "Mycelius — Biomaterials Grown from Fungi",
      },
    ],
  },

  // ── Twitter / X Card ──
  twitter: {
    card: "summary_large_image",
    title: "Mycelius — Biomaterials Grown from Fungi",
    description:
      "Premium biomaterials grown from mycelium. Biodegradable, fire-retardant, non-toxic — designed without compromise.",
    images: ["/mycelius-gemini-Photoroom.png"],
  },
};

// ── Viewport (separated from metadata per Next.js 14+ convention) ──
export const viewport: Viewport = {
  themeColor: "#12110E",
  width: "device-width",
  initialScale: 1,
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
