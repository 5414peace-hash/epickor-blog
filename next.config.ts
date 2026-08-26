import type { NextConfig } from "next";
import urlMappings from "./url_mappings.json";

type UrlMapping = { source: string; destination: string; };

const cardNewsImageTraceExcludes = [
  './public/assets/cardnews/**/*.png',
  './public/assets/cardnews/**/*.jpg',
  './public/assets/cardnews/**/*.jpeg',
  './public/assets/cardnews/**/*.webp',
];

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    '*': ['./output/**/*', ...cardNewsImageTraceExcludes],
    '/api/reels/*/visuals': ['./public/assets/reels/**/*'],
    '/reels-review/*': ['./public/assets/reels/**/*'],
  },

  async redirects() {
    // URL 매핑 파일에서 리다이렉트 생성
    return [
      // Instagram bio link. The bio shows a short branded path; the redirect
      // attaches the UTM so GA4 can separate Instagram arrivals from the
      // ~69% of sessions that land in `direct` with no referrer. Kept as a
      // 307 on purpose: a 301 gets cached in browsers and is hard to repoint.
      {
        source: '/ig',
        destination: '/?utm_source=instagram&utm_medium=bio',
        permanent: false,
      },
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
    // Vercel's image optimizer can hard-fail every next/image request when the
    // account's transformation quota is exhausted. EpicKor already serves its
    // local assets from /public, so bypass the optimizer and let browsers fetch
    // the original image URLs directly.
    unoptimized: true,
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
        hostname: 'd2wjm0du5kzgu5.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'mediahub.seoul.go.kr',
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
