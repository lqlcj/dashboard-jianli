export type DashboardPageConfig = {
  title: string
  description: string
  highlights: string[]
}

export const dashboardPageConfigs: Record<string, DashboardPageConfig> = {
  "project-management": {
    title: "人员管理",
    description: "管理成员信息与状态，支持增删改查并同步到全局数据。",
    highlights: ["新增成员", "编辑资料", "删除成员"],
  },
  "team-members": {
    title: "团队成员",
    description: "只读查看成员列表和当前任务状态。",
    highlights: ["成员名单", "任务分布", "参与状态"],
  },
  "command-center": {
    title: "指挥中心",
    description: "展示全局状态管理、活动审计流和通知中心。",
    highlights: ["Zustand 全局状态", "活动时间线", "流水线模拟"],
  },
  settings: {
    title: "设置",
    description: "维护账号偏好、通知策略和系统行为配置。",
    highlights: ["账号偏好", "通知配置", "权限设置"],
  },
  help: {
    title: "帮助",
    description: "查看功能说明与常见问题。",
    highlights: ["使用指南", "常见问题", "测试工单数据"],
  },
  search: {
    title: "搜索",
    description: "跨页面检索项目内容与任务。",
    highlights: ["全局搜索", "关键词过滤", "结果定位"],
  },
}

export function getDashboardTitleByPath(pathname: string): string {
  if (pathname === "/dashboard") {
    return "仪表盘"
  }

  const slug = pathname.replace("/dashboard/", "")
  return dashboardPageConfigs[slug]?.title ?? "仪表盘"
}
