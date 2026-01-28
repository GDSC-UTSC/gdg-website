/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blob.v0.dev",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
    formats: ["image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=60",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/sponsorship",
        destination: "https://drive.google.com/file/d/1YS9dVPr4wuEucKAQCheL7adLa81LieR0/view",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
