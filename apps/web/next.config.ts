import type { NextConfig } from "next";

const API_URL = process.env.CONFIG_API_URL ?? "http://localhost:3001/api/v1";
// Strip trailing /api/v1 to get the base origin for the rewrite destination
const API_BASE = API_URL.replace(/\/api\/v1\/?$/, "");

const nextConfig: NextConfig = {
  env: {
    // Keep exposing the var for any direct server-side usage
    CONFIG_API_URL: process.env.CONFIG_API_URL,
  },
  async rewrites() {
    return [
      {
        // Proxy all /api/v1/* browser requests through Next.js so the
        // browser never makes a cross-origin request to the tunnel URL.
        // This bypasses the Cloudflare Quick Tunnel CORS/interstitial issue.
        source: "/api/v1/:path*",
        destination: `${API_BASE}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/v1/:path*",
        headers: [
          // Tell Cloudflare tunnel to skip the browser warning interstitial
          { key: "bypass-tunnel-reminder", value: "true" },
        ],
      },
    ];
  },
};

export default nextConfig;
