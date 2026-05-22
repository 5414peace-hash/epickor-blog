import type { NextConfig } from "next";
import urlMappings from "./url_mappings.json";

type UrlMapping = { source: string; destination: string; };

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': ['./output/**/*'],
    '/api/reels/*/visuals': ['./public/assets/reels/**/*'],
    '/reels-review/*': ['./public/assets/reels/**/*'],
  },

  async redirects() {
    // URL 매핑 파일에서 리다이렉트 생성
    return [
      {
        source: '/blog/:id(\\d{3})-:slug(.*)',
        destination: '/blog/:id',
        permanent: true,
      },
      ...(urlMappings as UrlMapping[]).map((mapping) => ({
        source: mapping.source,
        destination: mapping.destination,
        permanent: true, // 301 리다이렉트
      })),
    ];
  },
  
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
    ];
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
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'private-us-east-1.manuscdn.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
