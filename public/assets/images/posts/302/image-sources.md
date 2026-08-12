# Image sources for Blog 302

- `korean-rice-soup-banchan.jpg` - Korean rice, soup, and banchan meal, photo by Cynthia Ortega Espinosa on Pexels, photo ID 13774715: https://www.pexels.com/photo/13774715/
- `rice-porridge.jpg` - Rice porridge with scallions, photo by FOX on Pexels, photo ID 32835478: https://www.pexels.com/photo/32835478/
- `gilgeori-toast.jpg` - Gilgeori toast, Photo Korea image by Alexbundo via Korea Tourism Organization: https://german.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=250633
- `kimchi-fried-rice.jpg` - Kimchi fried rice topped with egg, photo by Nadin Sh on Pexels, photo ID 24738523: https://www.pexels.com/photo/24738523/

Downloaded 2026-07-15. All four images were opened and manually checked for direct breakfast-section fit. The official gilgeori-toast source is lower resolution than the Pexels assets, so it is used as a supporting inline image rather than the hero.

## 2026-08-12 리프레시 — 죽 사진 교체 + 캡션 정밀화

| 조치 | 파일 | 사유 |
|---|---|---|
| **삭제** | `rice-porridge.jpg` (Pexels, FOX, ID 32835478) | 나무 숟가락·파란 테두리 그릇이라 **한국 죽보다 중화권 콘지에 가깝다.** 한국 표식이 하나도 없다 |
| **추가** | `jeonbokjuk-abalone-porridge.jpg` — Commons `File:Jeonbok-juk.jpg`, bryan…, **CC BY-SA 2.0**, 6720x4480 원본 | **전복죽 + 김치 + 김 + 동치미 + 스테인리스 그릇** — 한국 식당임이 프레임 안에서 증명된다 |

**왜 굳이 바꿨나.** 이번 리프레시가 죽 섹션에 **본죽 실가격(영양죽 ₩8,000~10,000, 전복죽 약 ₩18,900)** 을
넣었다. 특정 한국 체인의 특정 메뉴 가격 옆에 국적 불명의 콘지를 두면, 본문이 정밀해질수록 사진이
겉돈다. 어제 `145`에서 배운 것과 같은 구조다 — **본문에 사실을 촘촘히 넣을수록 기존 사진과 충돌할
표면이 늘어난다.**

교체본은 캡션에 쓸 사실도 준다: **전복죽의 초록빛은 양념이 아니라 전복 내장을 갈아 넣어 나오는 색**이라,
"제대로 만든 전복죽인지 구분하는 법"이 된다. 낡은 사진으로는 쓸 수 없던 문장이다.

**나머지 3장은 파일 그대로 두고 캡션만 정밀화했다.**
- `korean-rice-soup-banchan.jpg` — 사진의 뚝배기는 맑은 **국이 아니라 걸쭉한 찌개**다. 글의 축이
  `밥·국·반찬` 구조라 캡션에서 그 차이를 명시했다(둘 다 해당된다는 점까지).
- `gilgeori-toast.jpg` — 본문은 "양배추-달걀 오믈렛"이라 설명하지만 **사진에 양배추는 안 보인다**(달걀·햄·케첩).
  캡션은 **보이는 것만** 적었다. KTO 공식 이미지라 파일은 유지.
- `kimchi-fried-rice.jpg` — 변경 없음.

**Commons 다운로드 함정 (실측):** 해시 경로를 추측하면 안 된다. `Jeonbok-juk.jpg`를 `1/1a`로 짐작해
받았더니 **82바이트 오류 페이지**가 저장됐고 sharp가 `unsupported image format`으로 죽었다.
실제 경로는 `1/17`이다. **반드시 API가 반환한 `imageinfo.url`을 쓴다.**
