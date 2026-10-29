/** @OnlyCurrentDoc */ // limits the script to this one spreadsheet, not your whole Drive
// Backend for index.html. Paste into a Google Sheet: Bővítmények → Apps Script.
// Bevezetés → Új bevezetés → Webalkalmazás, Végrehajtás: Én, Hozzáférés: Bárki.
// After changing this file: Bevezetés → Bevezetések kezelése → ✏️ → Verzió: Új verzió (keeps the same URL).
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

// Public list: date, days, menu, and the name only if they allowed it. Email/phone stay in the sheet.
function doGet() {
  const rows = sheet.getDataRange().getValues().slice(1).map(r => ({
    datum: String(r[1]), napok: String(r[2]), nev: r[4] === 'igen' ? String(r[3]) : '', menu: String(r[5]),
  }));
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // leading ' stores everything as plain text: no formula injection, no date auto-conversion
  const text = s => "'" + String(s || '').slice(0, 300);
  const p = e.parameter;
  if (p.honlap) return ContentService.createTextOutput('ok'); // honeypot: only bots fill the hidden field
  if (!sheet.getLastRow()) sheet.appendRow(['Beküldve', 'Dátum', 'Napok', 'Név', 'Név látszik', 'Menü', 'Email', 'Telefon']);
  sheet.appendRow([new Date(), text(p.datum), text(p.napok), text(p.nev), text(p.mutat), text(p.menu), text(p.email), text(p.telefon)]);
  return ContentService.createTextOutput('ok');
}
