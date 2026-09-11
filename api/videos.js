const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wsruzvfatifqifpyosvx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_VIDEO_BUCKET || 'VIdeo';
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
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

function naturalSort(a, b) {
  return a.localeCompare(b, 'th', { numeric: true, sensitivity: 'base' });
}

function videoOrder(path) {
  const part = String(path).match(/part[-_\s]*(\d+)/i);
  if (part) return Number(part[1]);
  const anyNumber = String(path).match(/(\d+)/);
  return anyNumber ? Number(anyNumber[1]) : 999;
}

function sortVideos(a, b) {
  const order = videoOrder(a) - videoOrder(b);
  return order || naturalSort(a, b);
}

async function listObjects(prefix = '') {
  const rows = await supabase('/storage/v1/object/list/' + encodeURIComponent(BUCKET), {
    method: 'POST',
    body: JSON.stringify({
      prefix,
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })
  });
  const files = [];
  for (const row of rows || []) {
    const path = prefix ? prefix.replace(/\/$/, '') + '/' + row.name : row.name;
    if (row.metadata && VIDEO_EXT.test(row.name)) files.push(path);
    if (!row.metadata && row.name) files.push(...await listObjects(path));
  }
  return files;
}

async function signedUrl(path) {
  const data = await supabase('/storage/v1/object/sign/' + encodeURIComponent(BUCKET) + '/' + path.split('/').map(encodeURIComponent).join('/'), {
    method: 'POST',
    body: JSON.stringify({ expiresIn: 7200 })
  });
  return SUPABASE_URL + data.signedURL;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
    if (!SERVICE_KEY) return send(res, 500, { error: 'ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน Vercel' });
    const paths = (await listObjects()).sort(sortVideos).slice(0, 4);
    const videos = await Promise.all(paths.map(async (path, index) => ({
      title: 'คลิปที่ ' + (index + 1),
      file: path,
      url: await signedUrl(path)
    })));
    send(res, 200, { bucket: BUCKET, videos });
  } catch (err) {
    send(res, 500, { error: err.message || String(err) });
  }
};
