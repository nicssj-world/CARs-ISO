/**
 * Cloudflare Worker — CARS R2 Upload Proxy
 * รับไฟล์ multipart/form-data แล้วอัปโหลดไปยัง R2 bucket
 *
 * wrangler.toml ต้องผูก R2 bucket binding ชื่อ BUCKET
 * และตั้ง var R2_PUBLIC_DOMAIN (URL สาธารณะของ bucket เช่น https://pub-xxx.r2.dev)
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'POST') {
      return new Response('Not found', { status: 404, headers: CORS });
    }

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

    const publicUrl = `${env.R2_PUBLIC_DOMAIN}/${key}`;
    return new Response(JSON.stringify({ url: publicUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  },
};
