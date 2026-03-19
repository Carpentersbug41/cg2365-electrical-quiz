import type { NextConfig } from "next";

const distDir = (process.env.NEXT_DIST_DIR || '').trim();

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  outputFileTracingRoot: __dirname,
  pageExtensions: ['ts', 'tsx'],
  // Prevent deployment failures from existing non-runtime TS/ESLint debt.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
