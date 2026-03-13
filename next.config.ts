import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "rbcxlwqpyhymgdmmvxfd.supabase.co" },
      { protocol: "https", hostname: "**" },
    ],
  },
}

export default nextConfig
