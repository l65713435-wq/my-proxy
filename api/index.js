const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // 1. トップ画面を表示（検索窓がある画面）
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
              body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
              .container { max-width: 500px; margin: 50px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
              h1 { font-size: 1.1rem; color: #2c3e50; border-left: 5px solid #2c3e50; padding-left: 10px; margin-bottom: 20px; }
              .search-box { display: flex; flex-direction: column; gap: 10px; }
              input { padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; }
              button { padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
              button:active { background: #1a252f; }
              .hint { font-size: 0.75rem; color: #7f8c8d; margin-top: 15px; line-height: 1.4; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>世界史重要事項アーカイブ</h1>
              <div class="search-box">
                  <input type="text" id="q" placeholder="キーワードまたはURLを入力..." onkeypress="if(event.key==='Enter')go()">
                  <button onclick="go()">データベースを検索</button>
              </div>
              <div class="hint">
                  ※歴史的資料の閲覧を目的としています。<br>
                  URLを直接入力するか、検索ワードを入れてください。
              </div>
          </div>
          <script>
              function go() {
                  const query = document.getElementById('q').value;
                  if (!query) return;
                  let targetUrl = query;
                  // URL形式でない場合はGoogle検索へ
                  if (!query.startsWith('http')) {
                      targetUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                  }
                  // 現在のページに ?url=... を付けてリダイレクト
                  window.location.href = window.location.pathname + '?url=' + encodeURIComponent(targetUrl);
              }
          </script>
      </body>
      </html>
    `);
  }

  // 2. プロキシとして動作する部分
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
      },
      timeout: 10000 // 10秒でタイムアウト
    });
    
    res.setHeader('Content-Type', response.headers['content-type'] || 'text/html');
    return res.send(response.data);
  } catch (error) {
    return res.status(500).send('エラーが発生しました: ' + error.message);
  }
};
