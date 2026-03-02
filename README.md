# Dashboard 简历项目

一个基于 Next.js App Router 的企业管理仪表盘示例项目，包含登录鉴权、看板数据展示、项目模板管理、人员管理、团队只读视图、帮助中心与全局搜索。

## 项目定位

- 用途: 前端/全栈简历项目、管理后台模板、课程作业原型
- 场景: 中小团队的任务看板与人员信息维护
- 形态: 单仓库前端应用（内置 Mock 数据 + 本地持久化）

## 核心功能

### 1) 登录与访问控制

- 登录页: `/login`
- 登录接口: `POST /api/auth/login`
- 退出接口: `POST /api/auth/logout`
- 基于 Cookie 的会话状态（`dashboard_auth`）
- `middleware.ts` 对 `/dashboard/**` 做鉴权拦截，未登录自动跳转到登录页
- 登录后支持根据 `next` 参数回跳到原目标页面

### 2) 仪表盘首页

- 数据概览卡片（统计信息）
- 交互式面积图（支持 90 天 / 30 天 / 7 天切换）
- 项目模板数据表（增删改查 + 关键词搜索）

### 3) 项目模板管理（Dashboard Data）

- 表格展示模板记录（标题、类型、状态、负责人等）
- 支持新增、编辑、删除
- 支持关键字检索
- 支持一键重置到基线数据
- 数据持久化到 `localStorage`，刷新后不丢失

### 4) 人员管理（Project Management）

- 人员信息增删改查
- 条件筛选（状态）与关键词搜索
- 指标统计（总人数、在岗、请假、部门数）
- 支持重置为 `public/mock/personnel.json` 初始数据

### 5) 团队成员（只读）

- 从全局记录聚合成员任务数据
- 展示成员任务总数、进行中数量、状态
- 只读视图，不提供编辑入口

### 6) 帮助中心 + 全局搜索

- 使用指引与 FAQ
- 帮助工单表（来自 `public/mock/help-tickets.json`）
- 全局搜索页，按标题/类型/状态/负责人检索

## 数据策略

项目采用“本地优先 + Mock 回退”策略:

1. 先读取 `localStorage`（用户编辑后的数据）
2. 若本地无数据，再读取 `public/mock/*.json` 作为基线

当前使用的 Mock 文件:

- `public/mock/dashboard-records.json`
- `public/mock/personnel.json`
- `public/mock/help-tickets.json`

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Recharts（图表）
- Tabler Icons

## 工程亮点（简历可写）

- 采用 App Router + Route Handlers 实现前后端同仓开发模式
- 使用 Cookie + 中间件实现路由级鉴权与登录态保护
- 封装全局数据 Provider，统一管理 CRUD 与状态同步
- 实现本地持久化与 Mock 数据回退，提高可演示性与离线可用性
- 模块化页面架构（仪表盘、人员管理、帮助中心、搜索）便于扩展
- 适配 Cloudflare Pages 的 Edge Runtime 部署约束

## 简历描述示例（可直接使用）

- 独立开发基于 Next.js 16 + TypeScript 的管理后台项目，完成登录鉴权、仪表盘统计、项目模板与人员管理模块，支持全局搜索与帮助中心。
- 通过 Cookie + Middleware 实现路由级权限控制，覆盖登录、登出与未授权重定向流程。
- 设计本地数据层（localStorage）与 Mock 数据回退机制，支持增删改查与一键重置，提升演示稳定性。
- 基于 Recharts 构建可交互数据图表，结合组件化架构提升页面复用率与维护效率。

## 本地运行

```bash
npm install
npm run dev
```

默认访问: `http://localhost:3000`

## 构建检查

```bash
npm run lint
npm run build
```

## 演示账号

- 账号: `admin`
- 密码: `123456`

## 部署说明（Cloudflare Pages）

如果使用 `@cloudflare/next-on-pages` 构建，动态路由需要显式声明 Edge Runtime，例如:

```ts
export const runtime = "edge"
```

本项目当前关键动态路由已包含该配置（如 `/login`、`/api/auth/*`、`/dashboard/[slug]`）。
