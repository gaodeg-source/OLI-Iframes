// =====================================================================
//  OLI Email Store — Google Apps Script
//  Deploy as: Extensions → Apps Script → Deploy → New deployment
//    Type: Web app
//    Execute as: Me
//    Who has access: Anyone
//  Copy the web app URL into email-gate.js → API_URL
// =====================================================================

var SHEET_NAME = 'Emails';

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Email', 'Registered At', 'Last Updated']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  var result = { success: false };
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.action === 'register') {
      result = registerEmail(data.email);
    } else if (data.action === 'update') {
      result = updateEmail(data.oldEmail, data.email);
    }
  } catch (err) {
    result = { success: false, error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function registerEmail(email) {
  if (!email) return { success: false, error: 'No email provided' };
  var sheet = getSheet();
  var rows = sheet.getDataRange().getValues();

  // Skip if already registered
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === email) return { success: true, status: 'already_registered' };
  }

  sheet.appendRow([email, new Date(), new Date()]);
  return { success: true, status: 'registered' };
}

function updateEmail(oldEmail, newEmail) {
  if (!oldEmail || !newEmail) return { success: false, error: 'Missing email' };
  var sheet = getSheet();
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === oldEmail) {
      sheet.getRange(i + 1, 1).setValue(newEmail);
      sheet.getRange(i + 1, 3).setValue(new Date());
      return { success: true, status: 'updated' };
    }
  }

  // Old email not found — register as new
  sheet.appendRow([newEmail, new Date(), new Date()]);
  return { success: true, status: 'registered_as_new' };
}

// For testing in the Apps Script editor
function testRegister() {
  Logger.log(registerEmail('test@example.com'));
}
function testUpdate() {
  Logger.log(updateEmail('test@example.com', 'updated@example.com'));
}
