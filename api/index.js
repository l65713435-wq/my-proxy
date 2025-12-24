const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  // --- 【隠しページ】ゲーム一覧 ---
  if (url === 'hidden-games') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <body style="background:#1a1a1a; color:#00ffcc; font-family: sans-serif; padding:30px; text-align:center;">
        <h2 style="border-bottom:2px solid #00ffcc; padding-bottom:10px;">Archive - Secret Sector</h2>
        <div style="display:grid; grid-template-columns: 1fr; gap:15px; max-width:400px; margin:30px auto;">
          <a href="?url=https://elgoog.im/breakout/" style="color:#1a1a1a; background:#00ffcc; padding:15px; border-radius:8px; text-decoration:none; font-weight:bold;">ブロック崩し (Google)</a>
          <a href="?url=https://elgoog.im/t-rex/" style="color:#1a1a1a; background:#00ffcc; padding:15px; border-radius:8px; text-decoration:none; font-weight:bold;">恐竜ランゲーム</a>
          <a href="?url=https://www.google.com/logos/2010/pacman10-i.html" style="color:#1a1a1a; background:#00ffcc; padding:15px; border-radius:8px; text-decoration:none; font-weight:bold;">パックマン</a>
          <a href="?url=https://play.google.com/store/apps/details?id=com.rovio.abclassic" style="color:#00ffcc; border:1px solid #00ffcc; padding:10px; text-decoration:none; margin-top:20px;">[ 閉じる ]</a>
        </div>
        <p style="font-size:12px; color:#555; margin-top:50px;">このページは履歴に残りません</p>
        <script>function back(){ location.href='/'; }</script>
      </body>
    `);
  }

  // --- 【表の顔】歴史学習サイト ---
  if (!url) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <!DOCTYPE html>
      <html lang="ja">
      <head>
          <meta charset="UTF-8">
          <title>世界史重要事項アーカイブ</title>
          <style>
              body { font-family: "Helvetica Neue", Arial, sans-serif; background: #f0f2f5; margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 90%; max-width: 450px; text-align: center; }
              h1 { font-size: 1.4rem; color: #1a73e8; margin-bottom: 10px; border-bottom: 2px solid #e8f0fe; padding-bottom: 15px; }
              input { width: 100%; padding: 15px; border: 1px solid #dfe1e5; border-radius: 10px; box-sizing: border-box; font-size: 16px; margin-bottom: 15px; }
              button { width: 100%; padding: 15px; background: #1a73e8; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; }
              .footer { font-size: 11px; color: #9aa0a6; margin-top: 30px; position: relative; }
              /* 隠しスイッチ */
              #secret { cursor: default; user-select: none; }
          </style>
      </head>
      <body>
          <div class="card">
              <h1>世界史資料データベース</h1>
              <p style="font-size:0.9rem; color:#555;">歴史論文、資料のアーカイブを検索します。</p>
              <input type="text" id="q" placeholder="検索ワードを入力..." onkeypress="if(event.key==='Enter')go()">
              <button onclick="go()">資料を表示</button>
              <div class="footer">
                  <span id="secret" onclick="tap()">©</span> 2025 Historical Research Project
              </div>
          </div>
          <script>
              let count = 0;
              function tap() {
                  count++;
                  if (count >= 3) { location.href = '?url=hidden-games'; }
                  setTimeout(() => { count = 0; }, 2000); // 2秒以内に3回押さないとリセット
              }
              function go() {
                  const q = document.getElementById('q').value.trim();
                  if (!q) return;
                  let t = q.startsWith('http') ? q : 'https://www.google.com/search?q=' + encodeURIComponent(q);
                  location.href = '?url=' + encodeURIComponent(t);
              }
          </script>
      </body>
      </html>
    `);
  }

  // --- 【中継機能】 ---
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 });
    res.setHeader('Content-Type', response.headers['content-type'] || 'text/html');
    return res.send(response.data);
  } catch (e) {
    res.writeHead(302, { Location: url });
    res.end();
  }
};
