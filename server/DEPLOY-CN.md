# 后端部署（腾讯云 SCF Web 函数 / 任意 Docker 主机）

## 为什么要单独部署

前端在 EdgeOne（境内），后端原本在 Vercel（境外）。`sse-api-ruby.vercel.app`
在国内被 DNS 污染，EdgeOne 的服务器解析不了，所以登录和询盘全部失败。

浏览器**不会**直接访问后端（所有请求都走 Next.js 的服务端代理），所以后端只需要
让 **EdgeOne 的服务器**访问得到即可。

---

# 方案 1：腾讯云 SCF Web 函数（推荐，免运维）

## 1.1 构建镜像并推送到 TCR

在本地项目根目录：

```bash
cd server
docker build -t sse-api .

# 腾讯云容器镜像服务（TCR）地址，namespace 换成你自己的
docker login ccr.ccs.tencentyun.com
docker tag sse-api ccr.ccs.tencentyun.com/<namespace>/sse-api:latest
docker push ccr.ccs.tencentyun.com/<namespace>/sse-api:latest
```

> 镜像约 300–500MB（Prisma 引擎占大头），在 SCF 限制范围内。

## 1.2 创建函数

SCF 控制台 → 函数服务 → 新建：

| 配置项 | 值 |
|--------|-----|
| 创建方式 | **使用容器镜像** |
| 函数类型 | **Web 函数** |
| 镜像 | 上面推送的 `sse-api:latest` |
| 内存 | **512MB** 起（Prisma + Node 约需 256MB） |
| 超时时间 | **60 秒**（冷启动 + 首次数据库连接） |
| 端口 | **9000**（Web 函数固定，Dockerfile 已对齐） |

## 1.3 配置环境变量

在函数配置 → 环境变量里加（值从本仓库 `server/.env.local` 原样复制）：

```
DATABASE_URL=postgresql://...        # Neon，必须用带 -pooler 的连接串
JWT_SECRET=...                       # 必须与 Vercel 后端一致，否则旧 token 失效
CORS_ORIGIN=https://www.ssebatt.com
FRONTEND_URL=https://www.ssebatt.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=production
```

> `PORT` 不用配 —— 容器默认已经是 9000。

## 1.4 添加 HTTP 触发器

函数 → 触发器管理 → 添加 **API 网关触发器**，类型选 **Web 函数 / 免鉴权**。
创建后拿到一个访问地址，形如：

```
https://service-xxxxxxxx.gz.apigw.tencentcs.com/release/
```

## 1.5 验证

```bash
# 下面两种路径都试一下，哪个返回 {"ok":true} 就用哪个作为基础地址
curl https://<触发器地址>/v1/health
curl https://<触发器地址>/release/v1/health
```

## 1.6 接到 EdgeOne

EdgeOne 控制台 → 项目设置 → 环境变量：

| 变量名 | 值 |
|--------|-----|
| `API_BASE_URL` | 1.5 里验证通过的基础地址（**不带** `/v1`） |

重新部署，打开 `https://www.ssebatt.com/api/diag`，应该看到：

```json
{ "envSource": "API_BASE_URL", "reachable": true, "status": 200 }
```

## SCF 注意事项

- **冷启动**：闲置一段时间后首次请求会慢 2–5 秒。可开「预置并发」缓解（按量计费）。
- **数据库连接**：实例数会随并发增长，每个实例持有一条 Prisma 连接。务必用 Neon 的
  `-pooler` 连接串，否则容易打满连接上限。
- **超时**：API 网关默认超时通常 15 秒，上传大文件要注意。

---

# 方案 2：普通 Docker 主机（腾讯云轻量 / CVM）

```bash
curl -fsSL https://get.docker.com | sh          # 装 Docker
scp -r server root@<服务器IP>:/opt/sse-api      # 传代码
cd /opt/sse-api && vi .env                      # 填 1.3 里的变量，加 PORT=3001
docker build -t sse-api .
docker run -d --name sse-api --restart unless-stopped \
  --env-file .env -p 3001:3001 sse-api
curl http://localhost:3001/v1/health            # 应返回 {"ok":true}
```

安全组放行 3001，EdgeOne 的 `API_BASE_URL` 填 `http://<公网IP>:3001`。

---

## 排障

| 现象 | 检查 |
|------|------|
| 容器/函数起不来 | 看日志，多半是 `DATABASE_URL` 或 Prisma 引擎问题 |
| `/v1/health` 通但登录 401 | 账号密码错，或连到了错误的数据库 |
| EdgeOne 侧仍 `reachable: false` | 触发器没加、路径前缀不对，或 `API_BASE_URL` 少了端口/路径 |
| 冷启动超时 | 调大函数超时时间，或启用预置并发 |
