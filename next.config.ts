import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-static.collegedunia.com",
      },
    ],
  },
};

export default nextConfig;
