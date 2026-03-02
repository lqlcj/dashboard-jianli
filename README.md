# lcj仪表盘简�?

基于 Next.js App Router 的仪表盘简历项目，包含�?

- 仪表盘主页（统计、图表、模块管理）
- 人员管理（增删改查）
- 团队成员（只读展示）
- 设置、帮助、搜索子路由

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

项目已将模拟数据放到 `public/mock`，部署后可直接通过静态路径访问：

- `public/mock/dashboard-records.json`
- `public/mock/personnel.json`
- `public/mock/help-tickets.json`

应用读取优先级：

1. 浏览�?`localStorage`（用户已编辑数据�?
2. `public/mock/*.json`（默认模拟数据）

相关说明�?

- `DashboardDataProvider` 会读�?`/mock/dashboard-records.json`
- 人员管理页会读取 `/mock/personnel.json`
- 帮助页测试数据会读取 `/mock/help-tickets.json`

## 功能说明

### 人员管理

- 支持新增、编辑、删除人�?
- 支持关键词搜索与状态筛�?
- 支持“重置模拟数据”回�?`public/mock/personnel.json`

### 团队成员

- 只读展示成员任务统计
- 不提供增删改查操�?

### 帮助

- 使用指引 + FAQ
- 测试工单数据表（来自 `public/mock/help-tickets.json`�?

## 上线前检?

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
export const runtime = "edge";
```

本项目当前关键动态路由已包含该配置（如 `/login`、`/api/auth/*`、`/dashboard/[slug]`）。
