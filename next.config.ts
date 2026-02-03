import type { NextConfig } from "next";
import urlMappings from "./url_mappings.json";

const nextConfig: NextConfig = {
  async redirects() {
    // URL 매핑 파일에서 리다이렉트 생성
    return urlMappings.map((mapping: any) => ({
      source: mapping.source,
      destination: mapping.destination,
      permanent: true, // 301 리다이렉트
    }));
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oopy.lazyrockets.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'private-us-east-1.manuscdn.com',
      },
    ],
  },
};

export default nextConfig;
