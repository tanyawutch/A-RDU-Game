const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsruzvfatifqifpyosvx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'ardumfu@gmail.com';
const ALLOWED_DOMAINS = ['lamduan.mfu.ac.th'];

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function allowedEmail(email) {
  const normalized = String(email || '').toLowerCase();
  const domain = normalized.split('@').pop();
  return normalized === ADMIN_EMAIL || ALLOWED_DOMAINS.includes(domain);
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

async function currentUser(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) throw new Error('กรุณาเข้าสู่ระบบ');
  const res = await fetch(SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: SERVICE_KEY, Authorization: auth }
  });
  const user = await res.json();
  if (!res.ok) throw new Error(user?.message || 'ตรวจสอบผู้ใช้ไม่สำเร็จ');
  if (!allowedEmail(user.email)) throw new Error('ใช้งานได้เฉพาะอีเมล @lamduan.mfu.ac.th เท่านั้น');
  return user;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
    if (!SERVICE_KEY) return send(res, 500, { error: 'ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน Vercel' });
    const user = await currentUser(req);
    const rows = await supabase('/rest/v1/user_profiles?id=eq.' + encodeURIComponent(user.id) + '&select=id,email,role,login_count&limit=1');
    const existing = rows[0] || {};
    const payload = {
      id: user.id,
      email: String(user.email || '').toLowerCase(),
      role: existing.role || (String(user.email || '').toLowerCase() === ADMIN_EMAIL ? 'admin' : 'student'),
      login_count: Number(existing.login_count || 0) + 1,
      last_login_at: new Date().toISOString()
    };
    await supabase('/rest/v1/user_profiles?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload)
    });
    send(res, 200, { ok: true, login_count: payload.login_count });
  } catch (err) {
    send(res, 500, { error: err.message || String(err) });
  }
};
