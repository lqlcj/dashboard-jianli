"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type ActivitySource = "system" | "records" | "user"
type NotificationSeverity = "low" | "medium" | "high"

export type WorkspaceActivity = {
  id: string
  source: ActivitySource
  message: string
  createdAt: string
}

export type WorkspaceNotification = {
  id: string
  title: string
  detail: string
  severity: NotificationSeverity
  read: boolean
  createdAt: string
}

type PipelineState = {
  isRunning: boolean
  successRate: number
  throughput: number
  lastRunAt: string | null
}

type WorkspacePreferences = {
  focusMode: boolean
  autoRefresh: boolean
  sprintCapacity: number
}

type WorkspaceStore = {
  preferences: WorkspacePreferences
  activities: WorkspaceActivity[]
  notifications: WorkspaceNotification[]
  pipeline: PipelineState
  updatePreferences: (patch: Partial<WorkspacePreferences>) => void
  pushActivity: (message: string, source?: ActivitySource) => void
  pushNotification: (
    title: string,
    detail: string,
    severity?: NotificationSeverity
  ) => void
  markAllNotificationsRead: () => void
  clearActivities: () => void
  runPipelineSimulation: () => void
}

const ACTIVITY_LIMIT = 40
const NOTIFICATION_LIMIT = 20

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      preferences: {
        focusMode: false,
        autoRefresh: true,
        sprintCapacity: 28,
      },
      activities: [],
      notifications: [],
      pipeline: {
        isRunning: false,
        successRate: 97.8,
        throughput: 34,
        lastRunAt: null,
      },
      updatePreferences: (patch) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...patch,
          },
        })),
      pushActivity: (message, source = "system") =>
        set((state) => ({
          activities: [
            {
              id: makeId("act"),
              source,
              message,
              createdAt: new Date().toISOString(),
            },
            ...state.activities,
          ].slice(0, ACTIVITY_LIMIT),
        })),
      pushNotification: (title, detail, severity = "medium") =>
        set((state) => ({
          notifications: [
            {
              id: makeId("noti"),
              title,
              detail,
              severity,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ].slice(0, NOTIFICATION_LIMIT),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((item) => ({
            ...item,
            read: true,
          })),
        })),
      clearActivities: () => set({ activities: [] }),
      runPipelineSimulation: () => {
        set((state) => ({
          pipeline: {
            ...state.pipeline,
            isRunning: true,
          },
        }))

        window.setTimeout(() => {
          const successRate = Number((95 + Math.random() * 4.8).toFixed(1))
          const throughput = 30 + Math.floor(Math.random() * 16)
          const finishedAt = new Date().toISOString()
          const activityItem: WorkspaceActivity = {
            id: makeId("act"),
            source: "system",
            message: `CI 流水线完成：成功率 ${successRate}% ，吞吐 ${throughput} 任务/天`,
            createdAt: finishedAt,
          }
          const notificationItem: WorkspaceNotification = {
            id: makeId("noti"),
            title: "流水线完成",
            detail: `当前吞吐为 ${throughput} 任务/天`,
            severity: successRate >= 97 ? "low" : "medium",
            read: false,
            createdAt: finishedAt,
          }

          set((state) => ({
            pipeline: {
              isRunning: false,
              successRate,
              throughput,
              lastRunAt: finishedAt,
            },
            activities: [activityItem, ...state.activities].slice(0, ACTIVITY_LIMIT),
            notifications: [notificationItem, ...state.notifications].slice(
              0,
              NOTIFICATION_LIMIT
            ),
          }))
        }, 1300)
      },
    }),
    {
      name: "dashboard-workspace-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        activities: state.activities,
        notifications: state.notifications,
        pipeline: state.pipeline,
      }),
    }
  )
)
