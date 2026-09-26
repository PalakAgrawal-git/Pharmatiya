/**
 * Pharmatiya Health — website enquiries into a Google Sheet.
 *
 * Paste this into Extensions → Apps Script on the sheet that should hold the
 * enquiries, set the three values below, then Deploy → New deployment →
 * Web app → Execute as: Me → Who has access: Anyone → Deploy. Copy the
 * /exec URL it gives you; that is what the website posts to.
 *
 * The site sends JSON with a text/plain content type on purpose: an
 * application/json post would make the browser send a preflight request
 * first, and an Apps Script web app cannot answer one.
 */

// ── Settings ────────────────────────────────────────────────────────────
const SHEET_NAME = 'Enquiries';   // tab to write into; created if absent
const SHARED_TOKEN = '';          // optional; must match the site's token
// ────────────────────────────────────────────────────────────────────────

// This script only writes to the sheet. It sends no email, so authorising it
// asks for access to this spreadsheet and nothing else — no permission to
// send mail as you. Watch the sheet, or set a Google Sheets notification
// rule (Tools → Notification settings) if you want to be told about new rows.

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply(400, 'No data');

    const data = JSON.parse(e.postData.contents);

    // A shared word stops naive bots hitting the URL directly. Optional:
    // leave SHARED_TOKEN empty and this check is skipped.
    if (SHARED_TOKEN && data.token !== SHARED_TOKEN) return reply(403, 'Rejected');

    // Honeypot: a field no person can see, so anything in it is a bot.
    if (data.company || data.website) return reply(200, 'OK');

    // An email address is the one field every genuine enquiry has.
    const email = String(data.Email || data.email || '').trim();
    if (!email || email.indexOf('@') < 1) return reply(400, 'Invalid');

    const sheet = getSheet();
    const row = buildRow(sheet, data);
    sheet.appendRow(row);
    return reply(200, 'OK');
  } catch (err) {
    console.error(err);
    return reply(500, 'Error');
  }
}

/**
 * Visiting the URL in a browser reports which spreadsheet this deployment is
 * actually bound to, and how many rows it holds. If enquiries seem to vanish,
 * this says where they went: a script created from script.google.com rather
 * than from the sheet's own Extensions menu is bound to nothing, and a script
 * copied between sheets keeps writing to the original.
 */
function doGet() {
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    if (!book) {
      return reply(500, 'This script is not attached to any spreadsheet. ' +
        'Open the sheet, use Extensions > Apps Script, and paste it there.');
    }
    const sheet = book.getSheetByName(SHEET_NAME);
    return reply(200, JSON.stringify({
      running: true,
      spreadsheet: book.getName(),
      url: book.getUrl(),
      tab: SHEET_NAME,
      tabExists: !!sheet,
      rows: sheet ? Math.max(sheet.getLastRow() - 1, 0) : 0,
    }));
  } catch (err) {
    return reply(500, String(err));
  }
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(['Received']);
    sheet.setFrozenRows(1);
    styleHeaders(sheet);
  }
  return sheet;
}

/**
 * Writes into the columns that exist, and adds a column the first time a new
 * field appears — so a new form field never needs this script edited, and an
 * enquiry is never dropped because its shape changed.
 */
function buildRow(sheet, data) {
  const width = Math.max(sheet.getLastColumn(), 1);
  let headers = sheet.getRange(1, 1, 1, width).getValues()[0].filter(String);
  if (!headers.length) {
    headers = ['Received'];
    sheet.getRange(1, 1).setValue('Received');
    sheet.setFrozenRows(1);
  }

  const values = { Received: new Date() };
  Object.keys(data).forEach(function (key) {
    if (key === 'token' || key === 'company' || key === 'website') return;
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    values[label] = String(data[key]);
    if (headers.indexOf(label) === -1) {
      headers.push(label);
      sheet.getRange(1, headers.length).setValue(label);
      styleHeaders(sheet);
    }
  });

  return headers.map(function (header) {
    return values[header] === undefined ? '' : values[header];
  });
}

/**
 * The header row, in the website's own green. Run this by hand from the
 * editor (choose styleHeaders, press Run) to colour a sheet that already
 * has rows in it; after that it looks after itself, including when a new
 * form field adds a column.
 */
function styleHeaders(sheet) {
  sheet = sheet || SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const width = Math.max(sheet.getLastColumn(), 1);
  sheet.getRange(1, 1, 1, width)
    .setBackground('#2f8f81')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 32);
  // Widen to fit, but cap it: a message field left to size itself would
  // run off the screen and push every other column out of sight.
  sheet.autoResizeColumns(1, width);
  for (let c = 1; c <= width; c++) {
    if (sheet.getColumnWidth(c) > 320) sheet.setColumnWidth(c, 320);
  }
  sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), width)
    .setVerticalAlignment('top')
    .setWrap(true);
}

function reply(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
