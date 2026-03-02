# lcj仪表盘简历

基于 Next.js App Router 的仪表盘简历项目，包含：

- 仪表盘主页（统计、图表、模块管理）
- 人员管理（增删改查）
- 团队成员（只读展示）
- 设置、帮助、搜索子路由

## 技术栈

- Next.js 16
- React 19
- Tailwind CSS 4
- shadcn/ui

## 本地运行

```bash
npm install
npm run dev
```

默认访问：`http://localhost:3000`

## Mock 数据（已迁移到 public）

项目已将模拟数据放到 `public/mock`，部署后可直接通过静态路径访问：

- `public/mock/dashboard-records.json`
- `public/mock/personnel.json`
- `public/mock/help-tickets.json`

应用读取优先级：

1. 浏览器 `localStorage`（用户已编辑数据）
2. `public/mock/*.json`（默认模拟数据）

相关说明：

- `DashboardDataProvider` 会读取 `/mock/dashboard-records.json`
- 人员管理页会读取 `/mock/personnel.json`
- 帮助页测试数据会读取 `/mock/help-tickets.json`

## 功能说明

### 人员管理

- 支持新增、编辑、删除人员
- 支持关键词搜索与状态筛选
- 支持“重置模拟数据”回到 `public/mock/personnel.json`

### 团队成员

- 只读展示成员任务统计
- 不提供增删改查操作

### 帮助

- 使用指引 + FAQ
- 测试工单数据表（来自 `public/mock/help-tickets.json`）

## 上线前检查

```bash
npm run lint
npm run build
```

## Cloudflare 部署建议

如果你用 Cloudflare Pages 部署 Next.js：

1. 构建命令：`npm run build`
2. 输出目录：按你当前部署方案选择（Next.js 适配器方案或静态方案）
3. 确认 `public/mock` 目录被包含在部署产物中

部署后可直接验证：

- `/mock/dashboard-records.json`
- `/mock/personnel.json`
- `/mock/help-tickets.json`

以上三个地址可访问即代表模拟数据可用。
