import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "pjhbwttbbjqzclyxyuku.supabase.co",
        pathname: "/**",
      },
    ],
  },
};
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
export default withBundleAnalyzer(nextConfig);
