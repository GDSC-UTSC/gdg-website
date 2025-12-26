import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['three'],
  },
};

export default nextConfig;
