const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // 1. トップ画面（カモフラージュ）
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
              body { font-family: sans-serif; background: #f0f2f5; padding: 20px; display: flex; justify-content: center; align-items: center; height: 80vh; margin: 0; }
              .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
              h1 { font-size: 1.2rem; color: #1a73e8; margin-bottom: 20px; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 16px; margin-bottom: 15px; }
              button { width: 100%; padding: 12px; background: #1a73e8; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
              .footer { font-size: 11px; color: #777; margin-top: 20px; text-align: center; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>世界史資料データベース</h1>
              <input type="text" id="q" placeholder="検索ワードまたはURL..." onkeypress="if(event.key==='Enter')go()">
              <button onclick="go()">資料をリクエスト</button>
              <div class="footer">※教育用アカウントでの閲覧ログを保存しています</div>
          </div>
          <script>
              function go() {
                  const q = document.getElementById('q').value;
                  if (!q) return;
                  let t = q.startsWith('http') ? q : 'https://www.google.com/search?q=' + encodeURIComponent(q);
                  window.location.href = '?url=' + encodeURIComponent(t);
              }
          </script>
      </body>
      </html>
    `);
  }

  // 2. プロキシ処理
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8'
      },
      timeout: 15000
    });

    let contentType = response.headers['content-type'] || 'text/html';
    res.setHeader('Content-Type', contentType);

    // HTMLの場合のみ、リンクを書き換えてプロキシを継続させる
    if (contentType.includes('text/html')) {
      let html = response.data.toString('utf-8');
      // 簡易的なリンク書き換え（サイト内のリンクもプロキシを通すようにする）
      const baseUrl = new URL(url).origin;
      html = html.replace(/(src|href)="(?!http|#)([^"]+)"/g, `$1="${baseUrl}/$2"`);
      return res.send(html);
    }

    return res.send(response.data);
  } catch (e) {
    return res.status(500).send('アクセスエラー: リクエストが拒否されたか、URLが正しくありません。');
  }
};
