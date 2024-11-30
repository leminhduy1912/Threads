import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    }
  },
  reactStrictMode: false,
  images: {
    domains: ['th.bing.com'],
  },

  // You can add more Next.js configurations here if needed

  /* config options here */
};

export default nextConfig;
