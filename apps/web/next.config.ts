import type { NextConfig } from "next";

// Prefer 127.0.0.1 so Next's rewrite proxy matches uvicorn's bind address.
const apiOrigin = (
  process.env.EXTRACTOR_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/download-x-live-replay",
        destination: "/x-live-downloader",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "abs.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "video.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "ton.twimg.com", pathname: "/**" },
      { protocol: "https", hostname: "**.pscp.tv", pathname: "/**" },
      { protocol: "https", hostname: "prod-fastly-eu-west-3.video.pscp.tv", pathname: "/**" },
      { protocol: "https", hostname: "prod-fastly-ap-northeast-1.video.pscp.tv", pathname: "/**" },
      { protocol: "https", hostname: "prod-fastly-us-west-2.video.pscp.tv", pathname: "/**" },
      { protocol: "https", hostname: "prod-fastly-us-east-1.video.pscp.tv", pathname: "/**" },
    ],
  },
};

export default nextConfig;
