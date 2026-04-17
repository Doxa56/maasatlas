import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/maasatlas",
  assetPrefix: "/maasatlas/",
};

export default nextConfig;
