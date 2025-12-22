const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // 1. トップ画面（完全に学習サイトに見せかける）
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
              body { font-family: "Helvetica Neue", sans-serif; background: #f8f9fa; margin: 0; color: #333; }
              .header { background: #2c3e50; color: white; padding: 15px 20px; font-size: 1.2rem; font-weight: bold; }
              .container { max-width: 800px; margin: 30px auto; padding: 20px; }
              .search-section { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px; }
              h2 { font-size: 1rem; color: #666; margin-top: 0; }
              .input-group { display: flex; gap: 10px; margin-top: 15px; }
              input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
              button { padding: 12px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
              .link-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
              .link-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; text-decoration: none; color: #333; font-size: 0.9rem; transition: 0.2s; }
              .link-item:hover { background: #eef7fd; }
              .footer { text-align: center; font-size: 0.7rem; color: #999; margin-top: 50px; }
          </style>
      </head>
      <body>
          <div class="header">History Archive Online</div>
          <div class="container">
              <div class="search-section">
                  <h2>学術データベース検索</h2>
                  <div class="input-group">
                      <input type="text" id="q" placeholder="キーワードを入力..." onkeypress="if(event.key==='Enter')go()">
                      <button onclick="go()">検索実行</button>
                  </div>
              </div>

              <h2>クイックアクセス（推奨資料）</h2>
              <div class="link-grid">
                  <a href="#" class="link-item" onclick="jump('https://www.google.com')">Google 学術検索代行</a>
                  <a href="#" class="link-item" onclick="jump('https://www.wikipedia.org')">Wikipedia 歴史カテゴリ</a>
                  <a href="#" class="link-item" onclick="jump('https://www.youtube.com')">歴史映像アーカイブ (YT)</a>
                  <a href="#" class="link-item" onclick="jump('https://twitter.com')">リアルタイム歴史速報</a>
              </div>

              <div class="footer">
                  © 2025 Education Reference Database / 文部科学省学習指導要領準拠（自称）
              </div>
          </div>
          <script>
              // 直接プロキシを通すと403が出るため、Google等の大手は「リダイレクト」で飛ばす方式に変更
              function go() {
                  const q = document.getElementById('q').value;
                  if (!q) return;
                  const target = 'https://www.google.com/search?q=' + encodeURIComponent(q);
                  window.location.href = '?url=' + encodeURIComponent(target);
              }
              function jump(u) {
                  window.location.href = '?url=' + encodeURIComponent(u);
              }
          </script>
      </body>
      </html>
    `);
  }

  // 2. 転送処理
  // 403回避のため、中継せずにブラウザに「このURLへ行け」と命令（リダイレクト）を出す
  res.writeHead(302, { Location: url });
  res.end();
};
