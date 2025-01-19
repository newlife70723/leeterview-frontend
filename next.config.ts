import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  assetPrefix: process.env.NODE_ENV === "production" ? "https://cdn.leeterview.net" : "",
};



export default nextConfig;
