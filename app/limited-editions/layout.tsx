import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mycelius.com";

export const metadata: Metadata = {
  title: "Limited Editions — Fungi Grown Artifacts",
  description:
    "Explore and acquire bespoke, limited-run biomaterial artifacts and sculptural luminaires grown one piece at a time from pure mycelium and regenerative agricultural fibers.",
  alternates: {
    canonical: `${siteUrl}/limited-editions`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${siteUrl}/limited-editions`,
    siteName: "Mycelius",
    title: "Limited Editions — Fungi Grown Artifacts | Mycelius",
    description:
      "A small collection of objects grown in our bio-design lab. Produced in extremely limited quantities and released when available.",
    images: [
      {
        url: "/limited-1.png",
        width: 1200,
        height: 630,
        alt: "Mycelius Limited Edition Mayu Lamp Specimen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Limited Editions — Fungi Grown Artifacts | Mycelius",
    description:
      "Exclusive collector pieces and sculptural objects cultivated from living mycelium tissue.",
    images: ["/limited-1.png"],
  },
};

const jsonLdCollection = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Mycelius Limited Editions",
  description:
    "A small collection of limited-run biomaterial objects and luminaires grown in our lab from mycelium.",
  url: `${siteUrl}/limited-editions`,
  publisher: {
    "@type": "Organization",
    name: "Mycelius",
    url: siteUrl,
  },
};

export default function LimitedEditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }}
      />
      {children}
    </>
  );
}
