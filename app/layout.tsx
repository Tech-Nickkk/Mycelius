import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import Preloader from "./components/Preloader";
import PageTransition from "./components/PageTransition";
import localFont from "next/font/local";
import { Bricolage_Grotesque, Montserrat, Kodchasan } from "next/font/google";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const kodchasan = Kodchasan({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-kodchasan",
  display: "swap",
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
  display: "swap",
});

const forta = localFont({
  src: "./fonts/Forta.ttf",
  variable: "--font-forta",
  display: "swap",
});

const avenirNext = localFont({
  src: "./fonts/Avenir Next Ultra Light.otf",
  variable: "--font-avenir-next",
  display: "swap",
});

const zapfino = localFont({
  src: "./fonts/Zapfino.ttf",
  variable: "--font-zapfino",
  display: "swap",
});

const ardelaEdge = localFont({
  src: "./fonts/ARDELA-EDGE-X02-Regular.ttf",
  variable: "--font-ardela-edge",
  display: "swap",
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
  // ── Canonical & Alternates ──
  alternates: {
    canonical: siteUrl,
  },
};

// ── Viewport (separated from metadata per Next.js 14+ convention) ──
export const viewport: Viewport = {
  themeColor: "#12110E",
  width: "device-width",
  initialScale: 1,
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mycelius",
  url: siteUrl,
  logo: `${siteUrl}/logo.avif`,
  description:
    "Mycelius develops premium biomaterials grown from mycelium and agricultural waste for architects, interior designers, and luxury spaces.",
  sameAs: [
    "https://www.instagram.com/mycelius.lab",
    "https://www.linkedin.com/company/mycelius/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9354097886",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mycelius",
  url: siteUrl,
  description: "Biomaterials Grown from Fungi",
  publisher: {
    "@type": "Organization",
    name: "Mycelius",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolageGrotesque.variable} ${neueHaasDisplay.variable} ${forta.variable} ${montserrat.variable} ${kodchasan.variable} ${avenirNext.variable} ${zapfino.variable} ${ardelaEdge.variable} bg-[#12110E]`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen bg-[#12110E] text-white antialiased selection:bg-[#FF6118] selection:text-black" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
        <Preloader />
        <PageTransition />
      </body>
    </html>
  );
}
