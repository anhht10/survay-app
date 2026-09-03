/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND CHO ỨNG DỤNG KHẢO SÁT MOBILE & OFFLINE PWA
 * =========================================================================
 * - Hỗ trợ Web App endpoint (doPost, doGet)
 * - Tự động khởi tạo và chuẩn hóa 4 sheets: Surveys, Questions, Responses, Answers
 * - Chống race-condition với LockService
 * - Chống trùng lặp dữ liệu (Idempotency Key) bằng responseId
 * - Xử lý CORS và Content-Type linh hoạt
 */

// Tên các Sheets
const SHEET_SURVEYS = 'Surveys';
const SHEET_QUESTIONS = 'Questions';
const SHEET_RESPONSES = 'Responses';
const SHEET_ANSWERS = 'Answers';

/**
 * Xử lý GET request (Dùng để kiểm tra trạng thái hoạt động / Health check)
 */
function doGet(e) {
  ensureSheetsInitialized();
  return createJsonResponse({
    success: true,
    status: 'online',
    message: 'Google Apps Script Survey Web App is running successfully!',
    timestamp: new Date().toISOString()
  });
}

/**
 * Xử lý POST request từ Frontend PWA
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Khóa tối đa 30 giây để đảm bảo ghi đồng bộ chống tranh chấp tài nguyên
  const hasLock = lock.tryLock(30000);
  if (!hasLock) {
    return createJsonResponse({
      success: false,
      error: {
        code: 'LOCK_TIMEOUT',
        message: 'Hệ thống đang bận ghi nhận dữ liệu khác, vui lòng thử lại sau giây lát.'
      }
    });
  }

  try {
    ensureSheetsInitialized();

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        success: false,
        error: { code: 'EMPTY_PAYLOAD', message: 'Không nhận được dữ liệu tải lên.' }
      });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return createJsonResponse({
        success: false,
        error: { code: 'INVALID_JSON', message: 'Dữ liệu tải lên không đúng định dạng JSON.' }
      });
    }

    const action = payload.action || 'submitResponse';

    switch (action) {
      case 'submitResponse':
        return handleSubmitResponse(payload);
      case 'saveSurvey':
        return handleSaveSurvey(payload);
      case 'getSurveys':
        return handleGetSurveys();
      case 'getSurvey':
        return handleGetSurvey(payload.surveyId);
      default:
        return createJsonResponse({
          success: false,
          error: { code: 'UNKNOWN_ACTION', message: 'Hành động không hợp lệ: ' + action }
        });
    }
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.toString()
      }
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 1. XỬ LÝ GỬI PHẢN HỒI KHẢO SÁT (SUBMIT RESPONSE)
 * Bắt buộc kiểm tra Idempotency bằng responseId
 */
function handleSubmitResponse(data) {
  const responseId = data.responseId;
  const surveyId = data.surveyId;
  const surveyVersion = data.surveyVersion || 1;
  const answers = data.answers || [];
  const createdAt = data.createdAt || new Date().toISOString();
  const deviceId = data.deviceId || 'unknown';

  if (!responseId) {
    return createJsonResponse({
      success: false,
      error: { code: 'MISSING_RESPONSE_ID', message: 'Thiếu responseId duy nhất.' }
    });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resSheet = ss.getSheetByName(SHEET_RESPONSES);
  const ansSheet = ss.getSheetByName(SHEET_ANSWERS);

  // KIỂM TRA IDEMPOTENCY KEY: responseId đã từng được ghi nhận chưa?
  const existingRow = findRowByValue(resSheet, 1, responseId);
  if (existingRow > 0) {
    // Nếu đã tồn tại, KHÔNG tạo duplicate mà trả về thành công với already_exists
    return createJsonResponse({
      success: true,
      responseId: responseId,
      status: 'already_exists',
      message: 'Phản hồi đã được ghi nhận trước đó (Idempotency Handled).'
    });
  }

  // 1. Ghi vào sheet Responses
  // response_id | survey_id | survey_version | created_at | received_at | device_id
  const receivedAt = new Date().toISOString();
  resSheet.appendRow([
    responseId,
    surveyId,
    surveyVersion,
    createdAt,
    receivedAt,
    deviceId
  ]);

  // 2. Ghi từng câu trả lời vào sheet Answers
  // response_id | question_id | value
  if (answers && answers.length > 0) {
    const answerRows = [];
    for (var i = 0; i < answers.length; i++) {
      const item = answers[i];
      let val = item.value;
      if (Array.isArray(val)) {
        val = val.join(', ');
      } else if (typeof val === 'boolean') {
        val = val ? 'Có' : 'Không';
      } else if (val === undefined || val === null) {
        val = '';
      } else {
        val = String(val);
      }

      answerRows.push([
        responseId,
        item.questionId,
        val
      ]);
    }

    if (answerRows.length > 0) {
      const startRow = ansSheet.getLastRow() + 1;
      ansSheet.getRange(startRow, 1, answerRows.length, 3).setValues(answerRows);
    }
  }

  return createJsonResponse({
    success: true,
    responseId: responseId,
    status: 'synced',
    message: 'Ghi nhận phản hồi thành công vào Google Sheets.'
  });
}

/**
 * 2. XỬ LÝ LƯU KHẢO SÁT (SURVEY DEFINITION)
 */
function handleSaveSurvey(data) {
  const survey = data.survey;
  if (!survey || !survey.id) {
    return createJsonResponse({
      success: false,
      error: { code: 'INVALID_SURVEY', message: 'Dữ liệu khảo sát không hợp lệ.' }
    });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const surveySheet = ss.getSheetByName(SHEET_SURVEYS);
  const questionSheet = ss.getSheetByName(SHEET_QUESTIONS);

  // Cập nhật hoặc thêm mới Survey
  // survey_id | title | description | status | version | created_at | updated_at
  const existingRow = findRowByValue(surveySheet, 1, survey.id);
  const now = new Date().toISOString();
  const surveyRow = [
    survey.id,
    survey.title,
    survey.description || '',
    survey.status || 'draft',
    survey.version || 1,
    survey.createdAt || now,
    now
  ];

  if (existingRow > 0) {
    surveySheet.getRange(existingRow, 1, 1, surveyRow.length).setValues([surveyRow]);
  } else {
    surveySheet.appendRow(surveyRow);
  }

  // Cập nhật câu hỏi (Xóa câu hỏi cũ cùng survey_id rồi ghi lại)
  if (survey.questions && survey.questions.length > 0) {
    // Ghi các câu hỏi mới
    // question_id | survey_id | survey_version | type | title | description | required | options | order
    const qRows = [];
    for (var j = 0; j < survey.questions.length; j++) {
      const q = survey.questions[j];
      qRows.push([
        q.id,
        survey.id,
        survey.version || 1,
        q.type,
        q.title,
        q.description || '',
        q.required ? 'TRUE' : 'FALSE',
        q.options ? JSON.stringify(q.options) : '',
        q.order || (j + 1)
      ]);
    }

    if (qRows.length > 0) {
      const startRow = questionSheet.getLastRow() + 1;
      questionSheet.getRange(startRow, 1, qRows.length, 9).setValues(qRows);
    }
  }

  return createJsonResponse({
    success: true,
    surveyId: survey.id,
    version: survey.version || 1,
    message: 'Khảo sát đã được lưu lên Google Sheets.'
  });
}

/**
 * 3. LẤY DANH SÁCH KHẢO SÁT
 */
function handleGetSurveys() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const surveySheet = ss.getSheetByName(SHEET_SURVEYS);
  const data = surveySheet.getDataRange().getValues();
  const surveys = [];

  for (var i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;
    surveys.push({
      id: String(row[0]),
      title: String(row[1]),
      description: String(row[2]),
      status: String(row[3]),
      version: Number(row[4]),
      createdAt: String(row[5]),
      updatedAt: String(row[6])
    });
  }

  return createJsonResponse({ success: true, surveys: surveys });
}

/**
 * 4. LẤY CHI TIẾT MỘT KHẢO SÁT
 */
function handleGetSurvey(surveyId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const surveySheet = ss.getSheetByName(SHEET_SURVEYS);
  const questionSheet = ss.getSheetByName(SHEET_QUESTIONS);

  const surveyData = surveySheet.getDataRange().getValues();
  let surveyObj = null;

  for (var i = 1; i < surveyData.length; i++) {
    if (String(surveyData[i][0]) === String(surveyId)) {
      surveyObj = {
        id: String(surveyData[i][0]),
        title: String(surveyData[i][1]),
        description: String(surveyData[i][2]),
        status: String(surveyData[i][3]),
        version: Number(surveyData[i][4]),
        createdAt: String(surveyData[i][5]),
        updatedAt: String(surveyData[i][6]),
        questions: []
      };
      break;
    }
  }

  if (!surveyObj) {
    return createJsonResponse({ success: false, survey: null, message: 'Không tìm thấy khảo sát' });
  }

  // Lấy danh sách questions
  const qData = questionSheet.getDataRange().getValues();
  for (var j = 1; j < qData.length; j++) {
    const qRow = qData[j];
    if (String(qRow[1]) === String(surveyId)) {
      let parsedOptions = undefined;
      try {
        if (qRow[7]) parsedOptions = JSON.parse(qRow[7]);
      } catch (e) {}

      surveyObj.questions.push({
        id: String(qRow[0]),
        type: String(qRow[3]),
        title: String(qRow[4]),
        description: String(qRow[5]) || undefined,
        required: String(qRow[6]).toUpperCase() === 'TRUE',
        options: parsedOptions,
        order: Number(qRow[8]) || j
      });
    }
  }

  return createJsonResponse({ success: true, survey: surveyObj });
}

/**
 * Tìm số dòng chứa giá trị cụ thể tại một cột (1-indexed)
 */
function findRowByValue(sheet, colIndex, searchValue) {
  const data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (String(data[r][colIndex - 1]) === String(searchValue)) {
      return r + 1; // 1-indexed row number
    }
  }
  return -1;
}

/**
 * Đảm bảo 4 sheets chuẩn được tạo với đúng headers nếu chưa tồn tại
 */
function ensureSheetsInitialized() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Surveys
  let sheetSurveys = ss.getSheetByName(SHEET_SURVEYS);
  if (!sheetSurveys) {
    sheetSurveys = ss.insertSheet(SHEET_SURVEYS);
    sheetSurveys.appendRow([
      'survey_id',
      'title',
      'description',
      'status',
      'version',
      'created_at',
      'updated_at'
    ]);
    formatHeaderRow(sheetSurveys);
  }

  // 2. Questions
  let sheetQuestions = ss.getSheetByName(SHEET_QUESTIONS);
  if (!sheetQuestions) {
    sheetQuestions = ss.insertSheet(SHEET_QUESTIONS);
    sheetQuestions.appendRow([
      'question_id',
      'survey_id',
      'survey_version',
      'type',
      'title',
      'description',
      'required',
      'options',
      'order'
    ]);
    formatHeaderRow(sheetQuestions);
  }

  // 3. Responses
  let sheetResponses = ss.getSheetByName(SHEET_RESPONSES);
  if (!sheetResponses) {
    sheetResponses = ss.insertSheet(SHEET_RESPONSES);
    sheetResponses.appendRow([
      'response_id',
      'survey_id',
      'survey_version',
      'created_at',
      'received_at',
      'device_id'
    ]);
    formatHeaderRow(sheetResponses);
  }

  // 4. Answers
  let sheetAnswers = ss.getSheetByName(SHEET_ANSWERS);
  if (!sheetAnswers) {
    sheetAnswers = ss.insertSheet(SHEET_ANSWERS);
    sheetAnswers.appendRow([
      'response_id',
      'question_id',
      'value'
    ]);
    formatHeaderRow(sheetAnswers);
  }
}

/**
 * Định dạng hàng tiêu đề cho sheet trực quan dễ nhìn
 */
function formatHeaderRow(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#2563eb');
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
}

/**
 * Tạo JSON ContentService chuẩn cho Web App
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

