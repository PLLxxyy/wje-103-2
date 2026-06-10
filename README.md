# 甜品团购社区

甜品团购社区是一个移动端优先的全栈 Web 应用，用于浏览甜品店铺、发起团购、参与接龙、口味投票和提货管理。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Vant 4、Pinia、Vue Router、Axios、dayjs
- 后端：Node.js 18、Express、TypeScript、Prisma 5、JWT、bcrypt
- 数据库：MySQL 8.0
- 部署：Docker Compose、Nginx

## 功能特性

- 团购发起：团长选择店铺、设置价格、截止时间、提货点和投票选项
- 接龙参与：团员在团购详情页选择口味、数量和提货点
- 口味投票：每个用户在单个团购中限投一票，实时展示票数和比例
- 提货点管理：团购支持多个提货点、开放时间和容量限制
- 订单管理：团长按口味和提货点统计接龙，标记已提货
- 甜品店铺：浏览店铺资料、甜品条目和店铺团购记录
- JWT 认证与 RBAC：member、leader、admin 角色贯穿前后端

## 快速开始

前置条件：

- Docker
- Docker Compose

克隆项目后进入 `wje-103` 目录：

```bash
cp .env.example .env
docker compose up -d
```

访问地址：

- 前端：http://localhost:28603
- 后端 API：http://localhost:29603/api
- MySQL：localhost:57603

## 测试账号

- 团长：`13800000001` / `123456`
- 团员：`13800000002` / `123456`

## 项目结构

```text
frontend/
  src/api/          前端接口封装
  src/stores/       Pinia 状态
  src/pages/        移动端页面
  src/components/   共享组件
  src/router/       路由与权限守卫
backend/
  src/routes/       REST 路由
  src/controllers/  控制器
  src/services/     业务服务
  src/middlewares/  认证、权限、日志、错误处理
  prisma/           Prisma schema 与 seed
```

## API 文档

认证：

- `POST /api/auth/register` 注册
- `POST /api/auth/login` 登录
- `POST /api/auth/refresh` 刷新 token

用户：

- `GET /api/users/me` 当前用户
- `PUT /api/users/profile` 更新资料
- `GET /api/users/leaders` 团长列表

团购：

- `GET /api/groupbuys` 团购列表
- `GET /api/groupbuys/:id` 团购详情
- `POST /api/groupbuys` 创建团购，leader/admin
- `PATCH /api/groupbuys/:id/status` 更新状态，leader/admin

店铺：

- `GET /api/shops` 店铺列表
- `GET /api/shops/:id` 店铺详情
- `GET /api/shops/:id/desserts` 店铺甜品

接龙：

- `POST /api/joins` 参与接龙
- `GET /api/joins/my` 我的接龙
- `GET /api/joins/manage` 订单管理，leader/admin
- `PATCH /api/joins/:id/picked` 标记提货，leader/admin

投票：

- `GET /api/votes/groupbuy/:groupBuyId` 投票选项
- `GET /api/votes/groupbuy/:groupBuyId/results` 投票结果
- `POST /api/votes/groupbuy/:groupBuyId/options` 创建投票选项，leader/admin
- `POST /api/votes/:optionId` 提交投票

## 开发指南

本地后端：

```bash
cd backend
npm install
DATABASE_URL="mysql://gbsweet:gbsweetpass123@localhost:57603/wjesweetgroup" JWT_SECRET="dev-secret" npm run prisma:generate
DATABASE_URL="mysql://gbsweet:gbsweetpass123@localhost:57603/wjesweetgroup" JWT_SECRET="dev-secret" npm run dev
```

Prisma 命令：

```bash
npm run prisma:validate
npm run prisma:generate
npx prisma db push
npm run seed
```

本地前端：

```bash
cd frontend
npm install
npm run dev
```

## 部署说明

1. 在 `wje-103` 目录复制 `.env.example` 为 `.env`
2. 按需修改数据库密码和 `JWT_SECRET`
3. 执行 `docker compose up -d`
4. 后端容器启动时会执行 `prisma db push` 和 `prisma db seed`
5. 使用 `docker compose logs -f backend frontend` 查看启动日志
