# EpicKor Blog - Vercel 배포 가이드

## 프로젝트 개요

- **프로젝트명**: EpicKor Blog
- **기술 스택**: Next.js 14, TypeScript, Tailwind CSS
- **블로그 개수**: 10개 (047, 070, 074, 079, 086, 087, 088, 091, 093, 124)
- **도메인**: epickor.com

---

## Vercel 배포 단계

### 1. GitHub 저장소 생성

```bash
# GitHub CLI 사용 (추천)
gh repo create epickor-blog --public --source=. --remote=origin --push

# 또는 수동으로
git remote add origin https://github.com/YOUR_USERNAME/epickor-blog.git
git branch -M main
git push -u origin main
```

### 2. Vercel 프로젝트 생성

**옵션 A: Vercel CLI (추천)**
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

**옵션 B: Vercel 웹 대시보드**
1. https://vercel.com 접속
2. "New Project" 클릭
3. GitHub 저장소 연결
4. "epickor-blog" 선택
5. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
6. "Deploy" 클릭

### 3. 환경 변수 설정 (필요시)

Vercel 대시보드 → Settings → Environment Variables

```
# 현재는 환경 변수 없음
# 향후 필요시 추가
```

### 4. 도메인 연결

#### 4-1. Vercel에서 도메인 추가

1. Vercel 프로젝트 대시보드
2. Settings → Domains
3. "Add Domain" 클릭
4. `epickor.com` 입력
5. DNS 레코드 확인

#### 4-2. DNS 설정

**현재 DNS 제공업체에서 다음 레코드 추가**:

```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

또는 Vercel Nameservers 사용 (추천):

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

#### 4-3. SSL 인증서

Vercel이 자동으로 Let's Encrypt SSL 인증서 발급 (무료)

---

## 배포 후 확인 사항

### 1. 기본 페이지 확인

- ✅ 홈페이지: https://epickor.com
- ✅ 블로그 목록: https://epickor.com (메인 페이지)
- ✅ 개별 블로그: https://epickor.com/blog/124

### 2. 리다이렉트 테스트

기존 UUID URL이 새 URL로 리다이렉트되는지 확인:

```bash
# 124화 리다이렉트 테스트
curl -I https://epickor.com/2fb73cc3-0454-81bb-aaae-e3522d77b2bf

# 예상 결과:
# HTTP/2 301
# location: /blog/124
```

### 3. SEO 확인

- ✅ Sitemap: https://epickor.com/sitemap.xml
- ✅ Robots.txt: https://epickor.com/robots.txt
- ✅ 메타 태그 (Open Graph, Twitter Card)

### 4. Google Search Console 설정

1. https://search.google.com/search-console 접속
2. "속성 추가" → `epickor.com`
3. 도메인 소유권 확인 (DNS 레코드 또는 HTML 파일)
4. Sitemap 제출: `https://epickor.com/sitemap.xml`
5. URL 검사 도구로 주요 페이지 인덱싱 요청

---

## 자동 배포 설정

Vercel은 GitHub 저장소와 자동 연동되어 있어, `main` 브랜치에 푸시하면 자동으로 배포됩니다.

```bash
# 변경 사항 푸시
git add .
git commit -m "Update blog content"
git push origin main

# Vercel이 자동으로 감지하고 배포 시작
```

---

## 성능 최적화

### 1. 이미지 최적화

Next.js Image 컴포넌트가 자동으로 이미지 최적화:
- WebP 변환
- 반응형 이미지
- Lazy loading

### 2. 빌드 최적화

```json
// next.config.ts에 추가 (필요시)
{
  "compress": true,
  "poweredByHeader": false,
  "generateEtags": true
}
```

### 3. 캐싱 전략

Vercel Edge Network가 자동으로 정적 파일 캐싱

---

## 모니터링

### Vercel Analytics

1. Vercel 대시보드 → Analytics
2. 페이지 뷰, 성능 지표 확인

### Google Analytics (선택사항)

```tsx
// app/layout.tsx에 추가
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

---

## 트러블슈팅

### 배포 실패

```bash
# 로컬에서 빌드 테스트
pnpm build

# 에러 로그 확인
vercel logs
```

### 도메인 연결 실패

```bash
# DNS 전파 확인 (최대 48시간 소요)
dig epickor.com
nslookup epickor.com
```

### 리다이렉트 작동 안 함

- `next.config.ts` 확인
- `url_mappings.json` 파일 존재 확인
- Vercel 재배포

---

## 향후 작업

### 1. 나머지 블로그 마이그레이션

```bash
# 마이그레이션 스크립트 실행
python3 /home/ubuntu/migrate_remaining_blogs.py

# 커밋 및 푸시
git add content/blog/
git commit -m "Add remaining blog posts"
git push origin main
```

### 2. 이미지 추가

각 블로그의 `ogImage` 경로에 실제 이미지 추가:
```
public/images/blog/
├── 047/
│   └── hero.jpg
├── 070/
│   └── hero.jpg
└── ...
```

### 3. 디자인 개선

- 폰트 커스터마이징 (Google Fonts)
- 다크 모드 추가
- 애니메이션 효과

### 4. 기능 추가

- 검색 기능
- 태그 필터링
- 관련 블로그 추천
- 댓글 시스템 (Disqus, Giscus)

---

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel CLI 문서](https://vercel.com/docs/cli)
- [도메인 연결 가이드](https://vercel.com/docs/concepts/projects/domains)

---

## 지원

문제가 발생하면 다음을 확인하세요:
1. Vercel 대시보드 → Deployments → Logs
2. GitHub Actions (CI/CD 설정 시)
3. Vercel Support: https://vercel.com/support
