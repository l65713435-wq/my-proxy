const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // 1. トップ画面（世界史学習サイトへの偽装）
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
              body { font-family: "Helvetica Neue", Arial, sans-serif; background: #f0f2f5; margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 90%; max-width: 450px; text-align: center; }
              h1 { font-size: 1.4rem; color: #1a73e8; margin-bottom: 10px; border-bottom: 2px solid #e8f0fe; padding-bottom: 15px; }
              p { font-size: 0.9rem; color: #5f6368; margin-bottom: 25px; line-height: 1.5; }
              .input-group { display: flex; flex-direction: column; gap: 12px; }
              input { width: 100%; padding: 15px; border: 1px solid #dfe1e5; border-radius: 10px; box-sizing: border-box; font-size: 16px; outline: none; transition: border 0.3s; }
              input:focus { border-color: #1a73e8; }
              button { width: 100%; padding: 15px; background: #1a73e8; color: white; border: none; border-radius: 10px; font-weight: bold; font-size: 16px; cursor: pointer; transition: background 0.3s; }
              button:hover { background: #1765d2; }
              .footer { font-size: 11px; color: #9aa0a6; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>世界史資料データベース</h1>
              <p>研究論文、歴史的資料、および学術サイトの検索が可能です。キーワードまたはURLを入力してください。</p>
              <div class="input-group">
                  <input type="text" id="q" placeholder="検索ワード または URLを入力..." onkeypress="if(event.key==='Enter')go()">
                  <button onclick="go()">資料をリクエスト</button>
              </div>
              <div class="footer">
                  © 2025 Historical Data Archive Project<br>
                  教育ネットワーク経由のアクセスは記録されています。
              </div>
          </div>
          <script>
              function go() {
                  const q = document.getElementById('q').value.trim();
                  if (!q) return;
                  
                  let target;
                  if (q.startsWith('http://') || q.startsWith('https://')) {
                      target = q;
                  } else if (q.includes('.') && !q.includes(' ')) {
                      target = 'https://' + q;
                  } else {
                      // Googleよりブロックされにくい DuckDuckGo を使用
                      target = 'https://duckduckgo.com/html/?q=' + encodeURIComponent(q);
                  }
                  window.location.href = '?url=' + encodeURIComponent(target);
              }
          </script>
      </body>
      </html>
    `);
  }

  // 2. プロキシ処理（リンク書き換え機能付き）
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8'
      },
      timeout: 15000
    });

    let contentType = response.headers['content-type'] || 'text/html';
    res.setHeader('Content-Type', contentType);

    // HTMLファイルの場合のみ、相対パスの書き換えを試みる
    if (contentType.includes('text/html')) {
      let html = response.data.toString('utf-8');
      const origin = new URL(url).origin;
      
      // 画像やリンクが切れないように、ドメインを補完する簡易処理
      html = html.replace(/(src|href)="(?!http|#|javascript)([^"]+)"/g, `$1="${origin}/$2"`);
      return res.send(html);
    }

    return res.send(response.data);
  } catch (e) {
    return res.status(500).send(`
      <div style="font-family:sans-serif; padding:20px; text-align:center;">
        <h3>アクセスエラー</h3>
        <p>指定された資料（URL）にアクセスできませんでした。</p>
        <p style="color:red; font-size:0.8rem;">${e.message}</p>
        <button onclick="location.href='/'">戻る</button>
      </div>
    `);
  }
};
