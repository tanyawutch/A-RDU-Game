const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsruzvfatifqifpyosvx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

async function verifyUser(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) throw new Error('กรุณาเข้าสู่ระบบก่อนส่งแบบสอบถาม');
  const userRes = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: SERVICE_KEY, Authorization: auth }
  });
  const user = await userRes.json();
  if (!userRes.ok) throw new Error(user?.message || 'ตรวจสอบผู้ใช้ไม่สำเร็จ');
  if (!user.id || !user.email) throw new Error('ไม่พบอีเมลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
  return user;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    if (!SERVICE_KEY) return send(res, 500, { error: 'ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน Vercel' });
    const submission = await readBody(req);
    const user = await verifyUser(req);
    const payload = {
      user_id: user.id,
      email: user.email,
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
