# ---------- 后端 Express + Prisma ----------
# Build context: server/
# Build command path: server/Dockerfile
# Container port: 9000（腾讯云 SCF Web 函数固定要求 9000；
#                  普通主机上可用环境变量 PORT 覆盖）
# 启动命令: node server.js

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# 显式安装 express（server.js 需要；server/package.json 未声明）
# 运行期只需要正式依赖（prisma CLI 本身就在 dependencies 里，
# 所以下面的 generate 不受影响）；省掉 22 个 devDependencies 能显著减小镜像。
RUN npm ci --omit=dev --no-audit --no-fund && \
    npm install --no-save --no-audit --no-fund express@4

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma 需要在 build 时生成匹配 Linux 的引擎二进制
RUN npx prisma generate --schema=./prisma/schema.prisma

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=9000

# 非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/api ./api
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./server.js
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs
EXPOSE 9000

# 云平台自带健康探针，不要 Dockerfile 里写 HEALTHCHECK（会冲突）

CMD ["node", "server.js"]