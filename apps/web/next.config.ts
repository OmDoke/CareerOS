import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CONFIG_API_URL: process.env.CONFIG_API_URL,
  },
};

export default nextConfig;
