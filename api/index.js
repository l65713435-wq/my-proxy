const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // 1. トップ画面（カモフラージュ＆検索窓）
  if (!url) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>世界史重要事項アーカイブ</title>
          <style>
              body { font-family: sans-serif; background: #f4f4f4; color: #333; padding: 20px; }
              .container { max-width: 500px; margin: 50px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { font-size: 1.2rem; color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 20px; }
              .search-box { display: flex; flex-direction: column; gap: 10px; }
              input { padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 16px; }
              button { padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
              .footer { font-size: 0.7rem; color: #999; margin-top: 20px; text-align: center; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>世界史重要事項アーカイブ</h1>
              <div class="search-box">
                  <input type="text" id="q" placeholder="キーワード または https://..." onkeypress="if(event.key==='Enter')go()">
                  <button onclick="go()">資料を検索</button>
              </div>
              <p style="font-size:0.8rem; color:#666; margin-top:15px;">※URLを直接入力すると確実です。</p>
              <div class="footer">© 2025 Historical Research Project</div>
          </div>
          <script>
              function go() {
                  const q = document.getElementById('q').value.trim();
                  if (!q) return;
                  let t = q.startsWith('http') ? q : 'https://duckduckgo.com/html/?q=' + encodeURIComponent(q);
                  window.location.href = '?url=' + encodeURIComponent(t);
              }
          </script>
      </body>
      </html>
    `);
  }

  // 2. プロキシ中継処理
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8'
      },
      timeout: 15000
    });

    const contentType = response.headers['content-type'] || 'text/html';
    res.setHeader('Content-Type', contentType);

    // HTMLの場合はリンクを補完して送る
    if (contentType.includes('text/html')) {
      let html = response.data.toString('utf-8');
      try {
        const origin = new URL(url).origin;
        html = html.replace(/(src|href)="(?!http|#|javascript)([^"]+)"/g, `$1="${origin}/$2"`);
      } catch(e) {}
      return res.send(html);
    }

    return res.send(response.data);
  } catch (e) {
    // エラーが出た時も「学習サイト」風の画面で表示
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send(`
      <div style="font-family:sans-serif; padding:50px; text-align:center;">
        <h2>資料にアクセスできませんでした</h2>
        <p>アクセス制限、またはURLが間違っている可能性があります。</p>
        <p style="color:red;">Error: ${e.message}</p>
        <a href="/">トップに戻る</a>
      </div>
    `);
  }
};
