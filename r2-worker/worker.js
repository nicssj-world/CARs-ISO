/**
 * Cloudflare Worker — CARS R2 Upload + Serve
 * POST / → รับ multipart/form-data อัปโหลดไฟล์ไป R2 แล้วคืน URL ของ Worker นี้
 * GET  /?key=<key> → ดึงไฟล์จาก R2 แล้วส่งตรงให้ browser
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ─── GET: serve file ───────────────────────────────────────────
    if (request.method === 'GET') {
      const key = new URL(request.url).searchParams.get('key');
      if (!key) return new Response('Missing key', { status: 400, headers: CORS });

      const object = await env.BUCKET.get(key);
      if (!object) return new Response('Not found', { status: 404, headers: CORS });

      const headers = new Headers(CORS);
      headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
      const filename = key.split('/').pop();
      headers.set('Content-Disposition', `inline; filename="${filename}"`);
      return new Response(object.body, { status: 200, headers });
    }

    // ─── POST: upload file ─────────────────────────────────────────
    if (request.method === 'POST') {
      let form;
      try {
        form = await request.formData();
      } catch {
        return new Response('Invalid form data', { status: 400, headers: CORS });
      }

      const file = form.get('file');
      const ncId = form.get('ncId') || 'general';

      if (!file || typeof file === 'string') {
        return new Response('No file provided', { status: 400, headers: CORS });
      }

      const safeName = file.name.replace(/[^\w.\-]/g, '_');
      const key = `cars-nc/${ncId}/${Date.now()}-${safeName}`;

      try {
        await env.BUCKET.put(key, file.stream(), {
          httpMetadata: { contentType: file.type || 'application/octet-stream' },
        });
      } catch (err) {
        return new Response(`R2 put failed: ${err.message}`, { status: 500, headers: CORS });
      }

      // คืน URL ของ Worker นี้เอง (ไม่ต้องเปิด public bucket)
      const workerUrl = new URL(request.url).origin;
      const fileUrl = `${workerUrl}/?key=${encodeURIComponent(key)}`;
      return new Response(JSON.stringify({ url: fileUrl, key }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS },
      });
    }

    return new Response('Not found', { status: 404, headers: CORS });
  },
};
