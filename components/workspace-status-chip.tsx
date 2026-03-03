"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useWorkspaceStore } from "@/lib/stores/use-workspace-store"

export function WorkspaceStatusChip() {
  const { resolvedTheme, setTheme } = useTheme()
  const notifications = useWorkspaceStore((state) => state.notifications)

  const unreadCount = notifications.filter((item) => !item.read).length
  const isDark = resolvedTheme === "dark"

  return (
    <div className="ml-auto flex items-center gap-2">
      <Badge variant="outline">
        当前主题：{isDark ? "暗色" : "浅色"}
      </Badge>
      <Badge variant="outline">
        未读通知：{unreadCount}
      </Badge>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        切换暗黑模式
      </Button>
    </div>
  )
}
