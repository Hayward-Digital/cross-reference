const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/rest/V1/',
    createProxyMiddleware({
      target: 'https://hayward.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/rest/default/V1/',
    createProxyMiddleware({
      target: 'https://hayward.com',
      changeOrigin: true,
    })
  );
  app.use(
    '/media',
    createProxyMiddleware({
      target: 'https://hayward.com',
      changeOrigin: true,
    })
  );
};