import path from "path";

/** @type {import('next').NextConfig} */
// Trigger redeployment with CONVERSION_BACKEND_URL set
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.resolve("."),
  devIndicators: false,
  serverExternalPackages: ["uuid"],
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,POST" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, X-Requested-With, Accept",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
