const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // 1. トップ画面（世界史学習サイト風）
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
              body { font-family: sans-serif; background: #f4f4f4; color: #333; padding: 20px; text-align: center; }
              .container { max-width: 500px; margin: 50px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              h1 { font-size: 1.2rem; color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; margin-bottom: 20px; }
              input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 16px; box-sizing: border-box; margin-bottom: 15px; }
              button { width: 100%; padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
              .hint { font-size: 0.7rem; color: #888; margin-top: 15px; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>世界史重要事項アーカイブ</h1>
              <input type="text" id="q" placeholder="調べたいキーワード または URL..." onkeypress="if(event.key==='Enter')go()">
              <button onclick="go()">データベースを検索</button>
              <p class="hint">※キーワード入力時はGoogle検索へジャンプします。</p>
          </div>
          <script>
              function go() {
                  const q = document.getElementById('q').value.trim();
                  if (!q) return;
                  
                  if (q.startsWith('http')) {
                      // URLを直接入れた場合は中継（プロキシ）
                      window.location.href = '?url=' + encodeURIComponent(q);
                  } else {
                      // 検索ワードの場合は Google へ直接飛ばす（403回避）
                      window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(q);
                  }
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'text/html');
    return res.send(response.data);
  } catch (e) {
    // 403やエラーが出た場合は、真っ白な画面にならないよう直接リダイレクト
    res.writeHead(302, { Location: url });
    res.end();
  }
};
