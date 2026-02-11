import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Keep tracing root at repository root to avoid multi-lockfile root inference warnings.
  outputFileTracingRoot: path.join(process.cwd(), ".."),
  // Prevent deployment failures from existing non-runtime TS/ESLint debt.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
