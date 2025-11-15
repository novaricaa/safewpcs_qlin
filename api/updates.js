export default async function handler(req, res) {
  const FILE_URL = 'https://safew.qpon/assets/download/Windows.zip';

  const upstream = await fetch(FILE_URL, { redirect: 'follow' });
  if (!upstream.ok) {
    res.status(502).send('无法下载指定文件');
    return;
  }

  const filename = new URL(FILE_URL).pathname.split('/').pop() || 'download.bin';
  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';

  // 方式1：一次性读入内存（文件不大时用）
  const buf = Buffer.from(await upstream.arrayBuffer());
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(buf);

  // 方式2：流式转发（更省内存）——Node 18+/Vercel OK
  // const stream = Readable.fromWeb(upstream.body);
  // res.setHeader('Content-Type', contentType);
  // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  // res.setHeader('Cache-Control', 'no-store');
  // stream.pipe(res);
}
