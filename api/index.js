const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // ゲーム一覧画面（隠しページ）
  if (url === 'games') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <body style="background:#111; color:#0f0; font-family:monospace; padding:20px;">
        <h2>Archive - Hidden Sector</h2>
        <ul style="line-height:2;">
          <li><a href="?url=https://elgoog.im/breakout/" style="color:#0f0;">Block Breaker (Google)</a></li>
          <li><a href="?url=https://elgoog.im/t-rex/" style="color:#0f0;">Dino Run</a></li>
          <li><a href="?url=https://www.google.com/logos/2010/pacman10-i.html" style="color:#0f0;">PAC-MAN</a></li>
          <li><a href="/" style="color:#888;">[ Back to Main ]</a></li>
        </ul>
      </body>
    `);
  }

  // --- 以下はいつものトップ画面 ---
  if (!url) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
          <meta charset="UTF-8">
          <title>世界史重要事項アーカイブ</title>
          <style>
              body { font-family: sans-serif; background: #f4f4f4; text-align: center; padding: 50px; }
              .card { background: white; padding: 30px; border-radius: 12px; max-width: 450px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              input { width: 80%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; }
              button { padding: 10px 20px; background: #2c3e50; color: white; border: none; border-radius: 5px; cursor: pointer; }
              /* 隠しスイッチのスタイル */
              .secret-trigger { color: #f4f4f4; cursor: default; font-size: 10px; margin-top: 50px; display: inline-block; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>世界史重要事項アーカイブ</h1>
              <input type="text" id="q" placeholder="キーワード検索...">
              <button onclick="go()">検索</button>
              <div class="secret-trigger" onclick="checkCount()">.</div>
          </div>
          <script>
              let count = 0;
              function checkCount() {
                  count++;
                  if(count >= 3) { location.href = '?url=games'; }
              }
              function go() {
                  const q = document.getElementById('q').value.trim();
                  if (!q) return;
                  let target = q.startsWith('http') ? q : 'https://www.google.com/search?q=' + encodeURIComponent(q);
                  location.href = '?url=' + encodeURIComponent(target);
              }
          </script>
      </body>
      </html>
    `);
  }

  // プロキシ中継処理（中身はそのまま）
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
    res.setHeader('Content-Type', response.headers['content-type'] || 'text/html');
    return res.send(response.data);
  } catch (e) {
    res.writeHead(302, { Location: url });
    res.end();
  }
};
