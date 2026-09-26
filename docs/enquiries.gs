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
const SHEET_NAME = 'Enquiries';          // tab to write into; created if absent
const NOTIFY = 'admin@pharmatiya.net';   // who gets an email per enquiry ('' = none)
const SHARED_TOKEN = '';                 // optional; must match the site's token
// ────────────────────────────────────────────────────────────────────────

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

    if (NOTIFY) notify(data);
    return reply(200, 'OK');
  } catch (err) {
    console.error(err);
    return reply(500, 'Error');
  }
}

/** Visiting the URL in a browser should say something, not error. */
function doGet() {
  return reply(200, 'Pharmatiya enquiry endpoint is running.');
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(['Received']);
    sheet.setFrozenRows(1);
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
    }
  });

  return headers.map(function (header) {
    return values[header] === undefined ? '' : values[header];
  });
}

function notify(data) {
  const lines = Object.keys(data)
    .filter(function (k) { return k !== 'token' && String(data[k]).trim(); })
    .map(function (k) { return k + ': ' + data[k]; });

  MailApp.sendEmail({
    to: NOTIFY,
    replyTo: String(data.Email || data.email || ''),
    subject: 'Website enquiry: ' + (data['Enquiry type'] || 'New'),
    body: lines.join('\n\n') + '\n\n—\nSent from the Pharmatiya website.',
  });
}

function reply(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
