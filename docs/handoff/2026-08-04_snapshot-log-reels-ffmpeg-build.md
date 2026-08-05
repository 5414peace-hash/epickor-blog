# Snapshot log — 2026-08-04 (3rd session, Reels batch, ffmpeg build)

> Archived 2026-08-05. This snapshot describes the ffmpeg-assembled hub Reels batch that the
> representative scored 3/100 on 2026-08-05. Kept because the five ffmpeg traps recorded here
> are still true, and because the reason the batch failed is not visible from the replacement:
> the pipeline never went through `remotion/`, so the whole design system was silently absent.


## Current Snapshot - 2026-08-04 (3rd session, Reels)

- **릴스 3편 제작 중 — A 완성·전달, B v002 완성, C 조립 중.** 전부 카테고리 릴스이고 **허브로 보낸다**(단일 글이 아니라). A→`/drinks`, B→`/ramyun`, C→`/seoul`.
- **대표님이 세 번 제 판단을 뒤집으셨고 세 번 다 맞으셨다.** ① **fps** — 내가 30fps 컴포지션을 전제로 25fps 클립을 버렸는데 규칙 원문은 "네이티브 케이던스를 유지하거나"였다. ② **카테고리 릴스** — 내가 "글 1편 = 릴스 1편"으로 묶어 10개 중 7개를 소재 부족으로 탈락시켰는데, 카테고리로 풀자 **정지컷 241장**이 이미 우리 손에 있었다. **영상이 장면을, 정지컷이 제품을 맡으면** 일주일 내내 막혔던 팩샷 문제가 풀린다. ③ **대본** — 1고는 구조("거짓말이 점점 커진다")를 짜놓고 문장을 끼워 넣은 것이라 뚝뚝 끊겼다. 2고는 제일 센 물건을 맨 앞에 놓고 질문으로 끌고 연결어로 이었다.
- **파이프라인을 ffmpeg로 재구성했다. 순서가 핵심이다: TTS → 강제정렬 → 비트 경계에서 컷 산출 → 소재를 그 길이로 자름.** 스토리보드 먼저 짜면 반드시 어긋난다. Remotion을 안 쓴 이유는 이 머신이 `next build`에서 OOM이 나는데 4K 12편을 브라우저로 렌더하는 게 위험해서다. **스크립트 3종(`prep-generic`·`assemble`·`strip`)이 재사용 가능** — 다음 릴스는 컷 플랜 JSON만 주면 된다.
- **실측: 나레이션 233 wpm** (기본 보이스 설정). 200단어 ≈ 51초. 길이 추정에 쓴다.
- **QA가 잡은 ffmpeg 함정 5개 — 전부 렌더 후에만 보였다.** ① **오디오 드리프트 25프레임(0.83초)** — 나레이션 파트 사이 공백을 영상 concat이 삭제한다(해법: 컷을 다음 컷 시작 직전까지 연장). ② `-t`로 자르면 23.98 소스가 1프레임 부족(`-frames:v` 사용). ③ ASS Dialogue 필드 수 오류로 **모든 자막 앞에 쉼표**. ④ `WrapStyle: 2`가 줄바꿈을 꺼서 **긴 자막이 화면 밖으로 잘림**(0으로). ⑤ `adelay` 음수 실패 — 타임라인 원점을 `min(첫 컷, 모든 오디오 시작)`으로.
- **내용 규칙 두 개를 또 배웠다.** ① **정지컷은 배치 전에 밝기를 잰다** — Reel A에 휘도 16·28짜리가 들어가 **"맑은 레몬라임 탄산" 위에 검은 화면**이 깔렸다. ② **파일명을 믿지 않는다** — `carbo-buldak-pack-epickor-footage.jpg`가 실제로는 **파티 영상 캡처에 자막까지 박힌 것**이었고 "That's Buldak" 자리에 있었다. 같은 릴스에서 **진라면 얘기에 너구리 봉지**를 올린 것도 QA에서 잡았다. 셋 다 2026-08-03 카드뉴스 규칙이 겨냥한 그 실패다.
- **오늘 콘텐츠도 함께 나갔다**: 신규 5편(`362`~`366`) + 리프레시 2편(`198`·`200`), 전부 리뷰어 100/100·라이브 200. **`/drinks` 허브 신설**하고 **9편을 허브에 연결**했다(라면 허브에 진라면이 없었다). `next_slug`는 **`367`**.
- 직전 스냅샷은 `docs/handoff/2026-08-04_snapshot-log-w32c-and-hubs.md`로 내렸다.

## Active Work
