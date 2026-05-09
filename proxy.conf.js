// Dev-server proxy: forwards /api/squarespace/* to the Squarespace API and
// injects the Authorization header from .env so the access token never
// reaches the browser and CORS is bypassed during development.
require('dotenv').config();

const target = process.env.SQUARESPACE_API_BASE || 'https://api.squarespace.com';
const token = process.env.SQUARESPACE_ACCESS_TOKEN || '';
const appId = process.env.SQUARESPACE_APPLICATION_ID || 'concept-elite-dev';

if (!token) {
  // eslint-disable-next-line no-console
  console.warn(
    '[proxy.conf.js] SQUARESPACE_ACCESS_TOKEN is empty. ' +
      'Set it in .env to call the Squarespace API.',
  );
}

module.exports = {
  '/api/squarespace': {
    target,
    secure: true,
    changeOrigin: true,
    pathRewrite: { '^/api/squarespace': '' },
    onProxyReq: (proxyReq) => {
      if (token) {
        proxyReq.setHeader('Authorization', `Bearer ${token}`);
      }
      proxyReq.setHeader('User-Agent', appId);
      proxyReq.setHeader('Accept', 'application/json');
    },
  },
};
