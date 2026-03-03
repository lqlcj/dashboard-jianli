# Dashboard Resume Project

基于 Next.js App Router 的后台管理项目

## 技术栈

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Recharts
- Zustand（全局状态管理 + 持久化）
- next-themes（暗黑模式切换）

## 核心功能

- 登录鉴权（Cookie + Middleware）
- 仪表盘首页（统计卡片、图表、项目表格）
- 项目数据 CRUD（本地持久化 + Mock 回退）
- 人员管理（增删改查、搜索、状态过滤）
- 帮助中心与全局搜索
- 指挥中心（面试展示重点）
  - Zustand 全局状态 + 持久化
  - 活动审计时间线（跨模块事件汇总）
  - 通知中心（未读/已读）
  - CI Pipeline 模拟（成功率/吞吐变化）
- 顶部全局状态区
  - 未读通知计数
  - 一键切换暗黑模式（浅色/暗色）

## 本地运行

```bash
npm install
npm run dev
```

## 质量检查

```bash
npm run lint
npm run build
```

## 演示账号

- 用户名：`admin`
- 密码：`123456`
