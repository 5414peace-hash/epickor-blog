# EpicKor Blog

> **자체 블로그 엔진**: 노션 + 우피 대신 Next.js 기반 자체 블로그 시스템

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

---

## 🎯 프로젝트 개요

EpicKor 블로그는 기존 노션 + 우피(Oopy) 시스템을 대체하는 **완전 자동화된 자체 블로그 엔진**입니다.

### 주요 특징

- ✅ **완전 자동화**: 마크다운 파일만 추가하면 자동으로 블로그 생성
- ✅ **SEO 최적화**: Sitemap, Robots.txt, 메타 태그 자동 생성
- ✅ **301 리다이렉트**: 기존 UUID URL → 새 `/blog/{번호}` URL
- ✅ **세련된 디자인**: 매거진 스타일 반응형 레이아웃
- ✅ **빠른 성능**: Next.js 14 App Router + Vercel Edge Network
- ✅ **무료 호스팅**: Vercel 무료 플랜 (무제한 대역폭)

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 열기

### 3. 빌드

```bash
pnpm build
```

---

## 📝 블로그 추가 방법

### 1. 마크다운 파일 생성

`content/blog/` 디렉토리에 새 파일 생성:

```markdown
---
title: "블로그 제목"
slug: "125"
date: "2026-02-03"
description: "블로그 설명"
ogImage: "/images/blog/125/hero.jpg"
tags: ["Culture", "Travel", "Korea"]
author: "EpicKor"
---

# 블로그 제목

블로그 내용...
```

### 2. 이미지 추가 (선택사항)

`public/images/blog/125/` 디렉토리에 이미지 추가

### 3. 자동 빌드

파일을 추가하면 Next.js가 자동으로 페이지 생성

---

## 🌐 배포

### Vercel 배포 (추천)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

자세한 배포 가이드: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 현재 상태

- ✅ Next.js 14 프로젝트 초기화
- ✅ 마크다운 렌더링 시스템 구축
- ✅ 10개 블로그 마이그레이션
- ✅ 세련된 매거진 스타일 UI
- ✅ SEO 최적화 (Sitemap, Robots.txt)
- ✅ 301 리다이렉트 설정
- ✅ 반응형 디자인

---

**Made with ❤️ by EpicKor Team**
