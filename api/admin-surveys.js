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

async function verifyAdmin(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) throw new Error('กรุณาเข้าสู่ระบบแอดมิน');
  const userRes = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: SERVICE_KEY, Authorization: auth }
  });
  const user = await userRes.json();
  if (!userRes.ok) throw new Error(user?.message || 'ตรวจสอบสิทธิ์ไม่สำเร็จ');
  const email = String(user.email || '').toLowerCase();
  if (email === ADMIN_EMAIL) return user;
  const profiles = await supabase('/rest/v1/user_profiles?id=eq.' + encodeURIComponent(user.id) + '&role=eq.admin&select=id,email,role');
  if (!profiles.length) throw new Error('บัญชีนี้ไม่มีสิทธิ์แอดมิน');
  return user;
}

module.exports = async function handler(req, res) {
  try {
    if (!SERVICE_KEY) return send(res, 500, { error: 'ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน Vercel' });
    await verifyAdmin(req);
    if (req.method !== 'DELETE') return send(res, 405, { error: 'Method not allowed' });
    const body = await readBody(req);
    const id = String(body.id || '');
    if (!id) return send(res, 400, { error: 'ไม่พบรหัสรายการแบบสอบถาม' });
    await supabase('/rest/v1/survey_submissions?id=eq.' + encodeURIComponent(id), { method: 'DELETE' });
    send(res, 200, { ok: true });
  } catch (err) {
    send(res, 500, { error: err.message || String(err) });
  }
};
