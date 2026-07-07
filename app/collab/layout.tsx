import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "Start your Bioshift journey today. Partner with Mycelius to bring sustainable, fungi-grown biomaterials to your next architecture or design project.",
  openGraph: {
    title: "Collaborate with Mycelius",
    description:
      "Start your Bioshift journey today. Partner with Mycelius to bring sustainable biomaterials to your next project.",
  },
};

export default function CollabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
