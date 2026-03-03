"use client"

import * as React from "react"
import { IconActivityHeartbeat, IconBell, IconBolt, IconTrash } from "@tabler/icons-react"

import { useDashboardData } from "@/components/dashboard-data-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWorkspaceStore } from "@/lib/stores/use-workspace-store"

function formatTime(value: string) {
  return new Date(value).toLocaleString()
}

export function CommandCenterPage() {
  const { records } = useDashboardData()
  const preferences = useWorkspaceStore((state) => state.preferences)
  const activities = useWorkspaceStore((state) => state.activities)
  const notifications = useWorkspaceStore((state) => state.notifications)
  const pipeline = useWorkspaceStore((state) => state.pipeline)
  const updatePreferences = useWorkspaceStore((state) => state.updatePreferences)
  const runPipelineSimulation = useWorkspaceStore((state) => state.runPipelineSimulation)
  const clearActivities = useWorkspaceStore((state) => state.clearActivities)
  const markAllNotificationsRead = useWorkspaceStore((state) => state.markAllNotificationsRead)
  const pushNotification = useWorkspaceStore((state) => state.pushNotification)

  const doneCount = React.useMemo(
    () => records.filter((item) => item.status.includes("完成")).length,
    [records]
  )
  const activeCount = React.useMemo(
    () => records.filter((item) => item.status.includes("进行")).length,
    [records]
  )

  return (
    <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">项目记录总数</p>
            <p className="mt-1 text-2xl font-semibold">{records.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">进行中任务</p>
            <p className="mt-1 text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">已完成任务</p>
            <p className="mt-1 text-2xl font-semibold">{doneCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">流水线成功率</p>
            <p className="mt-1 text-2xl font-semibold">{pipeline.successRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBolt className="size-4" />
              工作区偏好设置
            </CardTitle>
            <CardDescription>
              基于 Zustand 的全局状态，修改后会跨页面同步并持久化。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sprint-capacity">迭代容量</Label>
              <Input
                id="sprint-capacity"
                type="number"
                min={1}
                max={200}
                value={preferences.sprintCapacity}
                onChange={(event) =>
                  updatePreferences({
                    sprintCapacity: Number(event.target.value || 1),
                  })
                }
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={preferences.focusMode ? "default" : "outline"}
                onClick={() =>
                  updatePreferences({
                    focusMode: !preferences.focusMode,
                  })
                }
              >
                专注模式：{preferences.focusMode ? "开启" : "关闭"}
              </Button>
              <Button
                type="button"
                variant={preferences.autoRefresh ? "default" : "outline"}
                onClick={() =>
                  updatePreferences({
                    autoRefresh: !preferences.autoRefresh,
                  })
                }
              >
                自动刷新：{preferences.autoRefresh ? "开启" : "关闭"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={pipeline.isRunning}
                onClick={runPipelineSimulation}
              >
                {pipeline.isRunning ? "流水线运行中..." : "模拟 CI 流水线"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  pushNotification(
                    "手动告警",
                    "你触发了一条手动工作区告警。",
                    "medium"
                  )
                }
              >
                推送演示通知
              </Button>
            </div>
            <div className="text-muted-foreground text-xs">
              当前吞吐：{pipeline.throughput} 任务/天
              {pipeline.lastRunAt ? `，上次运行：${formatTime(pipeline.lastRunAt)}` : ""}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBell className="size-4" />
              通知中心
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={markAllNotificationsRead}>
                全部标记已读
              </Button>
            </div>
            <div className="grid gap-2">
              {notifications.length === 0 ? (
                <p className="text-muted-foreground text-sm">暂无通知</p>
              ) : (
                notifications.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{item.title}</p>
                      <Badge variant={item.read ? "outline" : "default"}>
                        {item.read ? "已读" : "未读"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">{item.detail}</p>
                    <p className="text-muted-foreground mt-1 text-xs">{formatTime(item.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconActivityHeartbeat className="size-4" />
              活动时间线
            </CardTitle>
            <CardDescription>来自全局状态与业务 CRUD 的统一审计流。</CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={clearActivities}>
            <IconTrash />
            清空
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">暂无活动记录</p>
          ) : (
            activities.slice(0, 12).map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{item.source}</Badge>
                  <span className="text-muted-foreground text-xs">{formatTime(item.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm">{item.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
