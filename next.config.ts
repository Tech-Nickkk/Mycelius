import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.zyrosite.com",
      },
    ],
  },
  // Allow mobile device to access dev server over LAN
  allowedDevOrigins: ["10.89.10.222"],
};

export default nextConfig;
