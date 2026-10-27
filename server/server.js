// 后端生产入口（CloudBase 云托管 Docker 用）
// 复用 server/api/index.js 的 Vercel serverless handler，包一层 Express 监听 PORT
const handler = require('./api/index.js');
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查。除了探活，还带上运行环境的自检信息 ——
// 之前排查「Prisma 引擎加载不了」时，光看 500 分不清是镜像没更新、
// 还是镜像里引擎/openssl 不对，每次都要重来一轮构建。
app.get('/v1/health', (_req, res) => {
  let engines = [];
  try {
    engines = fs
      .readdirSync(path.join(__dirname, 'node_modules/.prisma/client'))
      .filter((f) => f.startsWith('libquery_engine'));
  } catch (e) {
    engines = [`read-error: ${e.code || e.message}`];
  }

  res.json({
    ok: true,
    platform: `${process.platform}-${process.arch}`,
    node: process.version,
    openssl: process.versions.openssl,
    // 镜像里实际存在的 Prisma 引擎文件名，用来判断是不是那一版镜像
    prismaEngines: engines,
    // 该有的运行时变量是否就位（只报有没有，不报值）
    env: {
      databaseUrl: Boolean(process.env.DATABASE_URL),
      jwtSecret: Boolean(process.env.JWT_SECRET),
      corsOrigin: Boolean(process.env.CORS_ORIGIN),
      frontendUrl: Boolean(process.env.FRONTEND_URL),
    },
  });
});

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