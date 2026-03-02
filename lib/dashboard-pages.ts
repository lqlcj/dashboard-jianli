export type DashboardPageConfig = {
  title: string
  description: string
  highlights: string[]
}

export const dashboardPageConfigs: Record<string, DashboardPageConfig> = {
  "project-management": {
    title: "人员管理",
    description: "管理人员信息与状态，支持增删改查并同步到全局数据。",
    highlights: ["新增人员", "编辑资料", "删除成员"],
  },
  "team-members": {
    title: "团队成员",
    description: "只读查看成员列表和当前状态，不提供增删改查操作。",
    highlights: ["成员名单", "角色分布", "参与状态"],
  },
  settings: {
    title: "设置",
    description: "管理账户偏好、通知策略和系统行为配置。",
    highlights: ["账户偏好", "通知配置", "权限设置"],
  },
  help: {
    title: "帮助",
    description: "查看功能说明和常见问题，并可查看测试数据。",
    highlights: ["使用指南", "常见问题", "测试工单数据"],
  },
  search: {
    title: "搜索",
    description: "跨页面检索项目内容、资料和任务，快速定位目标信息。",
    highlights: ["全局搜索", "关键字过滤", "结果定位"],
  },
}

export function getDashboardTitleByPath(pathname: string): string {
  if (pathname === "/dashboard") {
    return "仪表盘"
  }

  const slug = pathname.replace("/dashboard/", "")
  return dashboardPageConfigs[slug]?.title ?? "仪表盘"
}
