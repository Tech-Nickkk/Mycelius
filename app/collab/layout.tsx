import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mycelius.com";

export const metadata: Metadata = {
  title: "Collaborate — Start Your Bioshift Journey",
  description:
    "Partner with Mycelius for bespoke biomaterial architectural installations, cultivated furniture, acoustic wall panels, and sustainable luxury interior projects.",
  alternates: {
    canonical: `${siteUrl}/collab`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/collab`,
    siteName: "Mycelius",
    title: "Collaborate With Us | Mycelius",
    description:
      "Partner with Mycelius on custom biomaterials, architectural installations, and eco-luxury interiors grown from fungi.",
    images: [
      {
        url: "/mycelius-gemini-Photoroom.png",
        width: 1200,
        height: 630,
        alt: "Collaborate with Mycelius Lab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Collaborate With Us | Mycelius",
    description:
      "Have a space, product, or architectural idea in mind? Partner with Mycelius.",
    images: ["/mycelius-gemini-Photoroom.png"],
  },
};

export default function CollabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
