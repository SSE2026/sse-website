# NestJS Backend Server

深安锂能国际站后端 API 服务

## 技术栈

- **Framework**: NestJS 10
- **ORM**: Prisma 5
- **Database**: PostgreSQL
- **Auth**: JWT + Passport
- **API Docs**: Swagger/OpenAPI

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填入数据库配置
```

### 3. 数据库设置

```bash
# 生成 Prisma Client
npm run prisma:generate

# 创建数据库表
npm run prisma:push
# 或使用迁移
npm run prisma:migrate
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器运行在 http://localhost:3001

API 文档: http://localhost:3001/api/docs

## API 端点

### 认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户

### 用户
- `GET /api/v1/users/me` - 获取用户资料
- `PUT /api/v1/users/me` - 更新用户资料
- `GET /api/v1/users/me/favorites` - 获取收藏
- `POST /api/v1/users/me/favorites/:id` - 添加收藏
- `DELETE /api/v1/users/me/favorites/:id` - 删除收藏

### 行业
- `GET /api/v1/industries` - 获取所有行业
- `GET /api/v1/industries/with-companies` - 获取行业及公司
- `GET /api/v1/industries/:slug` - 获取行业详情

### 公司
- `GET /api/v1/companies` - 获取所有公司
- `GET /api/v1/companies/search?q=` - 搜索公司
- `GET /api/v1/companies/quote/:code` - 获取股票行情
- `GET /api/v1/companies/:code` - 获取公司详情

### 报告
- `GET /api/v1/reports/exports` - 获取导出历史
- `GET /api/v1/reports/latest` - 获取最新报告
- `POST /api/v1/reports/export` - 创建导出任务

## 生产部署

```bash
# 构建
npm run build

# 启动
npm run start:prod
```

## 数据库模型

- User - 用户
- Industry - 行业
- ChainNode - 产业链节点
- Company - 公司
- CompanyReport - 公司报告
- FinancialData - 财务数据
- ExportHistory - 导出历史
- FavoriteIndustry - 收藏行业
