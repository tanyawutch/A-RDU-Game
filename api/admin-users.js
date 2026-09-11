const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsruzvfatifqifpyosvx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = 'ardumfu@gmail.com';
const ALLOWED_DOMAINS = ['lamduan.mfu.ac.th'];

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function jsonBody(req) {
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

async function profileMap() {
  const profiles = await supabase('/rest/v1/user_profiles?select=id,email,role,created_at');
  return new Map(profiles.map(profile => [profile.id, profile]));
}

async function upsertProfile(user, role) {
  await supabase('/rest/v1/user_profiles?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({
      id: user.id,
      email: user.email,
      role: role || 'student',
      created_at: user.created_at || new Date().toISOString()
    })
  });
}

async function listUsers(res) {
  const data = await supabase('/auth/v1/admin/users?per_page=1000');
  const profiles = await profileMap();
  const users = (data.users || []).map(user => {
    const profile = profiles.get(user.id);
    return {
      id: user.id,
      email: user.email,
      role: profile?.role || user.user_metadata?.role || (String(user.email).toLowerCase() === ADMIN_EMAIL ? 'admin' : 'student'),
      email_confirmed_at: user.email_confirmed_at,
      last_sign_in_at: user.last_sign_in_at,
      created_at: user.created_at
    };
  });
  send(res, 200, { users });
}

module.exports = async function handler(req, res) {
  try {
    if (!SERVICE_KEY) return send(res, 500, { error: 'ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน Vercel' });
    await verifyAdmin(req);

    if (req.method === 'GET') return listUsers(res);

    const body = await jsonBody(req);
    if (req.method === 'POST') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const role = body.role === 'admin' ? 'admin' : 'student';
      if (!allowedEmail(email)) return send(res, 400, { error: 'อีเมลต้องเป็น @lamduan.mfu.ac.th เท่านั้น' });
      if (password.length < 6) return send(res, 400, { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
      const result = await supabase('/auth/v1/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { role } })
      });
      const user = result.user || result;
      await upsertProfile(user, role);
      return send(res, 200, { user });
    }

    if (req.method === 'PATCH') {
      const id = String(body.id || '');
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const role = body.role === 'admin' ? 'admin' : 'student';
      if (!id) return send(res, 400, { error: 'ไม่พบรหัสสมาชิก' });
      if (!allowedEmail(email)) return send(res, 400, { error: 'อีเมลต้องเป็น @lamduan.mfu.ac.th เท่านั้น' });
      const payload = { email, user_metadata: { role } };
      if (password) payload.password = password;
      const result = await supabase('/auth/v1/admin/users/' + encodeURIComponent(id), {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      const user = result.user || result;
      await upsertProfile(user, role);
      return send(res, 200, { user });
    }

    if (req.method === 'DELETE') {
      const id = String(body.id || '');
      if (!id) return send(res, 400, { error: 'ไม่พบรหัสสมาชิก' });
      await supabase('/auth/v1/admin/users/' + encodeURIComponent(id), { method: 'DELETE' });
      return send(res, 200, { ok: true });
    }

    send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    send(res, 500, { error: err.message || String(err) });
  }
};
