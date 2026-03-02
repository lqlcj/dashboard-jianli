# lcj仪表盘中后台项目

基于 Next.js App Router 的仪表盘中后台项目，包含:

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

项目已将模拟数据放到 `public/mock`，部署后可直接通过静态路径访问：

- `public/mock/dashboard-records.json`
- `public/mock/personnel.json`
- `public/mock/help-tickets.json`

## 功能说明

### 人员管理

- 支持新增、编辑、删除员工
- 支持新增、编辑、删除工作数据
- 支持关键词搜索与状态筛选

### 帮助

- 使用指引 + FAQ
- 测试工单数据表（来自 `public/mock/help-tickets.json`

## 上线前检查

```bash
npm run lint
npm run build
```

## 测试账号

账号：admin
密码：123456
