# 모바일 청첩장 — 오창휘 ♥ 유진희

2027. 03. 27 (토) 오전 11시 · 인천아시아드웨딩컨벤션 그레이스홀

순수 HTML/CSS/JS 단일 파일로 만든 모바일 청첩장입니다.

- **라이브 주소**: https://jinhee-yu.github.io/invitation/
- **표지 비교(작업용)**: 위 주소 뒤에 `#pick` → 키 `1·2·3` 또는 버튼으로 표지 전환 (하객 화면엔 안 보임)

---

## 파일 구성

```
index.html   청첩장 본체 (이거 하나가 전부)
Code.gs      방명록·RSVP 저장용 Google Apps Script
README.md    이 문서
```

## 로컬에서 보기

```bash
cd 이_폴더
python3 -m http.server 8000
```
→ 브라우저에서 `http://localhost:8000/`

> `file://`로 직접 열면 계좌 복사 등 일부 기능이 막히니 반드시 서버로 열 것.

## 수정 방법

| 바꿀 것 | 위치 (`index.html`) |
|---------|--------------------|
| 예식일 / 갤러리 사진 URL | `<script>` 상단 `CONFIG` 객체 |
| 신랑·신부 이름, 혼주, 날짜, 장소 | HTML 본문 텍스트 |
| 계좌번호 | `Gift` 섹션의 `data-acc` 및 표시 텍스트 |
| 색상·분위기 | `<style>` 최상단 `:root` 변수 (`--point`, `--bg` 등) |

## 배포

`main` 브랜치에 push하면 GitHub Pages가 1~2분 뒤 자동 반영합니다.

```bash
git add index.html
git commit -m "내용 수정"
git push
```

## 방명록 · RSVP (Google Sheets 연동)

방문자 메시지/참석 응답은 Google 스프레드시트에 저장됩니다.

1. 스프레드시트 → 확장 프로그램 → Apps Script
2. `Code.gs` 내용을 붙여넣고 저장
3. 배포 → 새 배포 → 유형 **웹 앱**, 액세스 권한 **모든 사용자**
4. 발급된 `/exec` URL을 `index.html`의 `CONFIG.scriptUrl`에 입력
5. 코드 수정 후 재배포 시에는 **기존 배포 → 편집 → 새 버전**으로 올려야 URL이 유지됨

- 저장 탭: `guestbook`, `rsvp` (없으면 자동 생성)
- 통신: 쓰기는 `no-cors` POST, 방명록 조회는 15초 간격 polling
