/**
 * 모바일 청첩장 - 방명록 + RSVP 저장용 Apps Script
 *
 * 배포 방법:
 *  1) 스프레드시트 열기 → 확장 프로그램 → Apps Script
 *  2) 이 코드 전체를 붙여넣기 → 저장
 *  3) 배포 → 새 배포 → 유형: 웹 앱
 *       - 실행 계정: 나
 *       - 액세스 권한: 모든 사용자
 *  4) 발급된 /exec URL 을 invitation.html 의 CONFIG.scriptUrl 에 입력
 *
 * 시트 탭 2개가 없으면 자동 생성됩니다: "guestbook", "rsvp"
 */

const SHEET_ID = '1EnoISqgfqxHZT_qwU4yPHE-rbiYkCgoFn1__1IWg_vk';

function getSheet_(name, header) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(header);
  }
  return sheet;
}

// 방명록 목록 조회
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'guestbook';
  if (action === 'guestbook') {
    const sheet = getSheet_('guestbook', ['시간', '이름', '메시지']);
    const rows = sheet.getDataRange().getValues().slice(1); // 헤더 제외
    const list = rows
      .map(r => ({ time: r[0], name: r[1], text: r[2] }))
      .reverse(); // 최신순
    return json_(list);
  }
  return json_({ ok: true });
}

// 방명록 / RSVP 저장
function doPost(e) {
  const body = JSON.parse(e.postData.contents);

  if (body.type === 'guestbook') {
    if (!body.name || !body.text) return json_({ ok: false, error: 'empty' });
    getSheet_('guestbook', ['시간', '이름', '메시지'])
      .appendRow([new Date(), String(body.name).slice(0, 20), String(body.text).slice(0, 300)]);
    return json_({ ok: true });
  }

  if (body.type === 'rsvp') {
    getSheet_('rsvp', ['시간', '구분', '이름', '참석여부', '인원', '식사', '연락처', '메모'])
      .appendRow([
        new Date(), body.side || '', body.name || '', body.attend || '',
        body.count || '', body.meal || '', body.phone || '', body.memo || '',
      ]);
    return json_({ ok: true });
  }

  return json_({ ok: false, error: 'unknown type' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
