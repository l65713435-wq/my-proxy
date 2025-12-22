const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // URLが指定されていない場合は、ダミーの学習用トップ画面を表示
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
              .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
              h1 { font-size: 1.2rem; color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; }
              p { font-size: 0.9rem; line-height: 1.6; }
              .search-box { margin: 20px 0; display: flex; gap: 5px; }
              input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
              button { padding: 10px 15px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; }
              .notice { font-size: 0.7rem; color: #999; margin-top: 20px; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>世界史重要事項アーカイブ（閲覧用）</h1>
              <p>本データベースは、個人の学習目的で歴史的資料を横断的に検索するためのものです。調べたい時代やキーワードを入力してください。</p>
              
              <div class="search-box">
                  <input type="text" id="target" placeholder="例: ルネサンス, 産業革命, https://...">
                  <button onclick="go()">検索</button>
              </div>

              <div class="links">
                  <p style="font-weight:bold;">【クイックアクセス】</p>
                  <ul style="font-size: 0.8rem;">
                      <li><a href="#" onclick="quick('https://www.google.com')">Google（資料検索）</a></li>
                      <li><a href="#" onclick="quick('https://ja.wikipedia.org')">Wikipedia（歴史カテゴリ）</a></li>
                  </ul>
              </div>

              <p class="notice">※学術利用を目的としているため、エンターテインメント目的の利用は推奨されません。</p>
          </div>

          <script>
              function go() {
                  let val = document.getElementById('target').value;
                  if (!val) return;
                  
                  // URLっぽくない場合はGoogle検索に飛ばす
                  if (!val.startsWith('http')) {
                      val = 'https://www.google.com/search?q=' + encodeURIComponent(val);
                  }
                  window.location.href = '?url=' + encodeURIComponent(val);
              }
              function quick(u) {
                  window.location.href = '?url=' + encodeURIComponent(u);
              }
              // エンターキーでも検索できるようにする
              document.getElementById('target').addEventListener('keypress', function(e) {
                  if (e.key === 'Enter') go();
              });
          </script>
      </body>
      </html>
    `);
  }

  // --- 以下はプロキシの仕組み（変更なし） ---
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};
