export default async function handler(req, res) {
  const FILE_URL = 'https://down.r3p.club?d=L215dnJoZm8vb3NzLWFwLXNvdXRoZWFzdC0xLzAvc2FmZXdfU2V0dXA2LjMxLnppcA==';

  const upstream = await fetch(FILE_URL, { redirect: 'follow' });

  if (!upstream.ok) {
    res.status(502).send('无法下载指定文件');
    return;
  }

  // 透传上游的 content-type
  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);

  // 透传上游的 content-disposition（带文件名）
  const upstreamDisposition = upstream.headers.get('content-disposition');
  if (upstreamDisposition) {
    res.setHeader('Content-Disposition', upstreamDisposition);
  } else {
    // 如果上游没有，就自己造一个（可选）
    const fallbackName = 'download.bin';
    res.setHeader('Content-Disposition', `attachment; filename="${fallbackName}"`);
  }

  res.setHeader('Cache-Control', 'no-store');

  // --- 方式1：一次性读入内存 ---
  const buf = Buffer.from(await upstream.arrayBuffer());
  res.send(buf);

  // --- 方式2：流式转发（Node 18+/Vercel）---
  // import { Readable } from 'stream';
  // const stream = Readable.fromWeb(upstream.body);
  // stream.pipe(res);
}
