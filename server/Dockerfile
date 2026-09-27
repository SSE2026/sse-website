# ---------- 后端 Express + Prisma (CloudBase 云托管) ----------
# Build context: server/
# Build command path: server/Dockerfile
# Container port: 3001
# 启动命令: node server.js

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc ./
# 显式安装 express（dev-server.js 需要；server/package.json 未声明）
RUN npm ci --no-audit --no-fund && \
    npm install --no-save --no-audit --no-fund express@4 && \
    npm install --no-save --no-audit --no-fund dotenv@16

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma 需要在 build 时生成匹配 Linux 的引擎二进制
RUN npx prisma generate --schema=./prisma/schema.prisma

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

# 非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/api ./api
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./server.js
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/v1/health || exit 1

CMD ["node", "server.js"]