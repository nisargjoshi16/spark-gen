import type { NextConfig } from "next";

const isPwaBuild = process.env.PWA_BUILD === "1";
const basePath = isPwaBuild ? "/spark-gen" : "";

const nextConfig: NextConfig = {
  // Keep Playwright out of the serverless bundle on Vercel.
  serverExternalPackages: ["playwright"],
  ...(isPwaBuild
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
