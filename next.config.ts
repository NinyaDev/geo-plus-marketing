import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["telegraf", "@google/genai"],
};

export default nextConfig;
