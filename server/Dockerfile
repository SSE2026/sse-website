# ---------- 后端 Express + Prisma ----------
# Build context: server/
# Dockerfile 路径: server/Dockerfile
# 容器端口: 9000（腾讯云 SCF Web 函数固定要求；普通主机可用 PORT 覆盖）
# 启动命令: node server.js
#
# 镜像体积说明：生产入口只有 api/index.js + server.js，用到的包就是
# package.prod.json 里那 6 个。server/package.json 里的 NestJS 全套、
# typescript、jest 等只服务于旧入口，全部不进镜像 —— 之前整包安装让镜像
# 多出约 300MB，而从 GitHub 跨洋推到 TCR 慢得离谱。

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.prod.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund

FROM node:20-alpine AS builder
# Prisma 靠系统里的 OpenSSL 决定用哪个引擎。alpine 默认不带 openssl，
# 探不到 OpenSSL 3 就会退回要 libssl.so.1 的老引擎，而 alpine 只有 3 ——
# 运行时报 "Error loading shared library libssl.so.1"。装上是必须的。
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY prisma ./prisma
# Prisma CLI 用 npx 临时下载，不留在镜像里；生成后只保留 musl 用的引擎，
# 其余平台（debian / rhel）的引擎删掉再省约 40MB。
RUN npx --yes prisma@5.22.0 generate --schema=./prisma/schema.prisma && \
    find node_modules/.prisma node_modules/@prisma \
      -name 'libquery_engine-*.so.node' ! -name '*linux-musl*' -delete 2>/dev/null || true

FROM node:20-alpine AS runner
# 运行期同样需要 —— 引擎是动态链接 libssl.so.3 的。
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9000

# 非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --chown=nodejs:nodejs api ./api
COPY --chown=nodejs:nodejs server.js ./server.js
COPY --chown=nodejs:nodejs package.prod.json ./package.json

USER nodejs
EXPOSE 9000

# 云平台自带健康探针，不要 Dockerfile 里写 HEALTHCHECK（会冲突）

CMD ["node", "server.js"]
