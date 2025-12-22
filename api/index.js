export default async function handler(req, res) {
  const { url: targetUrl } = req.query;

  // URLの指定がない場合は、シンプルな入力画面を表示
  if (!targetUrl) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>V-Proxy</title>
        <style>
          body { background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .container { text-align: center; width: 90%; }
          input { padding: 15px; width: 70%; border-radius: 8px; border: 1px solid #333; background: #111; color: #fff; font-size: 16px; outline: none; }
          button { padding: 15px 25px; border-radius: 8px; background: #fff; color: #000; cursor: pointer; border: none; font-weight: bold; margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>V-Proxy</h1>
          <input type="text" id="url" placeholder="google.com">
          <button onclick="go()">Go</button>
        </div>
        <script>
          function go() {
            let u = document.getElementById('url').value.trim();
            if(u) {
              if(!u.startsWith('http')) u = 'https://' + u;
              window.location.href = "/api?url=" + encodeURIComponent(u);
            }
          }
          document.getElementById('url').onkeypress = (e) => { if(e.key === 'Enter') go(); };
        </script>
      </body>
      </html>
    `);
  }

  try {
    // ターゲットサイトへアクセス
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    });

    const contentType = response.headers.get('content-type') || '';
    
    // HTMLの場合、リンクをプロキシ経由に書き換える
    if (contentType.includes('text/html')) {
      let html = await response.text();
      const origin = new URL(targetUrl).origin;
      
      // 相対パス（/style.cssなど）をプロキシ経由に変換
      html = html.replace(/(href|src)=["']\/([^"']+)["']/g, (match, p1, p2) => {
        return `${p1}="/api?url=${encodeURIComponent(origin + '/' + p2)}"`;
      });

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(html);
    }

    // 画像やその他のリソースはそのまま返す
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    return res.send(Buffer.from(buffer));

  } catch (err) {
    return res.status(500).send("Proxy Error: " + err.message);
  }
}
