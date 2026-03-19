import { readFile } from 'node:fs/promises';

const baseUrl = 'http://localhost:3000';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function baselineTurn(message, thread = [], attachment = null) {
  const response = await fetch(`${baseUrl}/api/simple-chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, thread, attachment }),
  });

  const text = await response.text();
  return {
    status: response.status,
    text,
    finishReason: decodeURIComponent(response.headers.get('x-simple-chatbot-finish-reason') ?? ''),
    systemInstruction: decodeURIComponent(response.headers.get('x-simple-chatbot-system-instruction') ?? ''),
    userId: decodeURIComponent(response.headers.get('x-simple-chatbot-user-id') ?? ''),
    profileFound: response.headers.get('x-simple-chatbot-profile-found') === 'true',
    attachmentFilename: decodeURIComponent(response.headers.get('x-simple-chatbot-attachment-filename') ?? ''),
    attachmentChars: Number(response.headers.get('x-simple-chatbot-attachment-chars') ?? '0'),
  };
}

async function uploadAttachment(filePath, filename) {
  const bytes = await readFile(filePath);
  const blob = new Blob([bytes], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', blob, filename);

  const response = await fetch(`${baseUrl}/api/simple-chatbot/source-upload`, {
    method: 'POST',
    body: formData,
  });
  const json = await response.json();
  return { status: response.status, json };
}

const report = {
  startedAt: new Date().toISOString(),
  baseUrl,
  checks: [],
};

try {
  const t1 = await baselineTurn('Teach me Unit 203');
  report.checks.push({
    name: 'baseline_first_turn',
    status: t1.status,
    finishReason: t1.finishReason,
    replyLength: t1.text.length,
    preview: t1.text.slice(0, 300),
  });
  assert(t1.status === 200, 'Baseline first turn did not return 200');
  assert(t1.finishReason === 'STOP', `Baseline first turn finishReason was ${t1.finishReason || 'empty'}`);
  assert(t1.text.length > 300, `Baseline first turn too short: ${t1.text.length}`);
  assert(!t1.text.trim().endsWith('{') && !t1.text.includes('"assistantMessage"'), 'Baseline first turn leaked JSON');

  const thread = [
    { role: 'user', text: 'Teach me Unit 203' },
    { role: 'assistant', text: t1.text },
  ];
  const t2 = await baselineTurn('Sorry?', thread);
  report.checks.push({
    name: 'baseline_follow_up',
    status: t2.status,
    finishReason: t2.finishReason,
    replyLength: t2.text.length,
    preview: t2.text.slice(0, 300),
  });
  assert(t2.status === 200, 'Baseline follow-up did not return 200');
  assert(t2.finishReason === 'STOP', `Baseline follow-up finishReason was ${t2.finishReason || 'empty'}`);
  assert(t2.text.length > 80, `Baseline follow-up too short: ${t2.text.length}`);
  assert(!t2.text.includes('"assistantMessage"'), 'Baseline follow-up leaked JSON');

  const upload = await uploadAttachment(
    'C:\\Users\\carpe\\Desktop\\hs_quiz\\quiz-app\\resources\\203-4A-earthing-systems-and-ads-components-attachment.txt',
    '203-4A-earthing-systems-and-ads-components-attachment.txt'
  );
  report.checks.push({
    name: 'attachment_upload',
    status: upload.status,
    extractedChars: upload.json?.extractedChars ?? null,
    filename: upload.json?.filename ?? null,
  });
  assert(upload.status === 200, 'Attachment upload did not return 200');
  assert(upload.json?.success === true, 'Attachment upload did not return success');
  assert(typeof upload.json?.text === 'string' && upload.json.text.length > 500, 'Attachment text too short');

  const t3 = await baselineTurn('Teach me Unit 203', [], {
    filename: upload.json.filename,
    text: upload.json.text,
  });
  report.checks.push({
    name: 'baseline_with_attachment',
    status: t3.status,
    finishReason: t3.finishReason,
    replyLength: t3.text.length,
    attachmentFilename: t3.attachmentFilename,
    attachmentChars: t3.attachmentChars,
    preview: t3.text.slice(0, 300),
  });
  assert(t3.status === 200, 'Baseline with attachment did not return 200');
  assert(t3.finishReason === 'STOP', `Baseline with attachment finishReason was ${t3.finishReason || 'empty'}`);
  assert(t3.text.length > 300, `Baseline with attachment too short: ${t3.text.length}`);
  assert(t3.attachmentFilename === upload.json.filename, 'Attachment filename header missing');
  assert(t3.attachmentChars === upload.json.text.length, 'Attachment char header mismatch');
  assert(!t3.text.includes('"assistantMessage"'), 'Baseline with attachment leaked JSON');

  report.success = true;
} catch (error) {
  report.success = false;
  report.error = error instanceof Error ? error.message : String(error);
}

console.log(JSON.stringify(report, null, 2));
