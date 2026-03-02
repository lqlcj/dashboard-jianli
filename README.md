# 中后台仪表盘简介

## 搭建基于 Next.js 16 + React 19 + TypeScript 的企业管理仪表盘，覆盖登录鉴权、看板统计、项目模板管理、人员管理、帮助中心和全局搜索。

- 仪表盘主页（统计、图表、模块管理）
- 人员管理（增删改查）
- 设置、帮助、搜索子路由
- 路由鉴权机制，支持登录/登出、未授权重定向
- 使用 Recharts 构建的可交互趋势图

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Radix UI
- Recharts（图表）
- Tabler Icons

## 工程亮点

- 采用 App Router + Route Handlers 实现前后端同仓开发模式
- 使用 Cookie + 中间件实现路由级鉴权与登录态保护
- 封装全局数据 Provider，统一管理 CRUD 与状态同步
- 实现本地持久化与 Mock 数据回退，提高可演示性与离线可用性
- 模块化页面架构（仪表盘、人员管理、帮助中心、搜索）便于扩展
- 适配 Cloudflare Pages 的 Edge Runtime 部署约束

- 独立开发基于 Next.js 16 + TypeScript 的管理后台项目，完成登录鉴权、仪表盘统计、项目模板与人员管理模块，支持全局搜索与帮助中心。
- 通过 Cookie + Middleware 实现路由级权限控制，覆盖登录、登出与未授权重定向流程。
- 设计本地数据层（localStorage）与 Mock 数据回退机制，支持增删改查与一键重置，提升演示稳定性。
- 基于 Recharts 构建可交互数据图表，结合组件化架构提升页面复用率与维护效率。

## 本地运行

```bash
npm install
npm run dev
```

## 功能说明

### 人员管理

- 支持新增、编辑、删除
- 支持关键词搜索与状态筛选

## 演示账号

- 账号: `admin`
- 密码: `123456`
