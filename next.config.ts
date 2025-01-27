import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      domains: ['leeterview-bucket.s3.amazonaws.com'], // 在這裡添加你的圖片域名
  },
};

module.exports = nextConfig;

