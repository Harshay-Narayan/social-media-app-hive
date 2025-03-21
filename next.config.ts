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

export default nextConfig;
