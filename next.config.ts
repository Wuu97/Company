import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/** Keep the live development cache separate from production builds. */
export default function nextConfig(phase: string): NextConfig {
  return {
    outputFileTracingRoot: process.cwd(),
    ...(phase === PHASE_DEVELOPMENT_SERVER ? { distDir: ".next-dev" } : {}),
  };
}
