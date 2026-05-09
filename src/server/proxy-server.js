require('dotenv').config();
const express = require('express');

const app = express();
const token = process.env.AccessToken || '';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use('/api/squarespace/v2', async (req, res) => {
  const url = `https://connect.squareup.com/v2${req.path}${req.url.includes('?') ? '?' + req.url.split('?')[1] : ''}`;
  console.log('[proxy-server] fetching:', url);
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[proxy-server] error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4201, () => console.log('[proxy-server] running on http://localhost:4201'));