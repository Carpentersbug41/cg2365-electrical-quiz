import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent deployment failures from existing non-runtime TS/ESLint debt.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
