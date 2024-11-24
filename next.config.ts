import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    }
  },
  images: {
    domains: ['th.bing.com'],
  },
  /* config options here */
};

export default nextConfig;
