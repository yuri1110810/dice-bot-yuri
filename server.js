const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 簡単なHTTPサーバーを起動してGlitchが停止しないようにする
app.get('/', (req, res) => {
  res.send('🎲 ダイスbot yuri is running!');
});

app.get('/status', (req, res) => {
  res.json({ 
    status: 'online',
    bot: 'dice-bot-yuri',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Keep-alive server running on port ${port}`);
}); 