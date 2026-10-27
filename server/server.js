// 后端生产入口（CloudBase 云托管 Docker 用）
// 复用 server/api/index.js 的 Vercel serverless handler，包一层 Express 监听 PORT
const handler = require('./api/index.js');

const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 简单健康检查（Dockerfile 的 HEALTHCHECK 用）
app.get('/v1/health', (_req, res) => res.json({ ok: true }));

// 所有其他请求走 handler
app.use((req, res) => handler(req, res));

// 监听地址固定 0.0.0.0 —— 不要读 process.env.HOSTNAME：
// Docker / 云函数运行时会把它设成容器 ID，拿它当绑定地址会解析到容器内网 IP，
// 平台健康检查从外部就连不上了。需要时用 HOST 显式覆盖。
const port = parseInt(process.env.PORT || '3001', 10);
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
  console.log(`[sse-api] listening on http://${host}:${port}`);
});