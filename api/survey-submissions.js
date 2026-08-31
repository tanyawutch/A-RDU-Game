const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsruzvfatifqifpyosvx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'ardumfu@gmail.com';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (err) { reject(err); }
    });
  });
}

async function supabase(path, options = {}) {
  const res = await fetch(SUPABASE_URL + path, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: 'Bearer ' + SERVICE_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || data?.error || text || 'Supabase request failed');
  return data;
}

async function fallbackUserId() {
  const rows = await supabase('/rest/v1/user_profiles?email=eq.' + encodeURIComponent(ADMIN_EMAIL) + '&select=id&limit=1');
  if (!rows.length) throw new Error('ไม่พบบัญชีแอดมินสำหรับผูกข้อมูลแบบสอบถาม');
  return rows[0].id;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    if (!SERVICE_KEY) return send(res, 500, { error: 'ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน Vercel' });
    const submission = await readBody(req);
    const userId = await fallbackUserId();
    const payload = {
      user_id: userId,
      email: submission.email || 'guest-questionnaire',
      profile: submission.profile || {},
      confidence: submission.confidence || {},
      knowledge: submission.knowledge || {},
      quiz_score: submission.quiz?.score ?? null,
      quiz_total: submission.quiz?.total ?? null,
      quiz_percent: submission.quiz?.percent ?? null,
      satisfaction: submission.satisfaction || {},
      suggestion: submission.suggestion || '',
      game_score_text: submission.score || '',
      game_stars_text: submission.stars || '',
      payload: submission || {}
    };
    const data = await supabase('/rest/v1/survey_submissions', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload)
    });
    send(res, 200, { ok: true, id: data?.[0]?.id || null });
  } catch (err) {
    send(res, 500, { error: err.message || String(err) });
  }
};
