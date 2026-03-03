"use client"

import * as React from "react"
import { useWorkspaceStore } from "@/lib/stores/use-workspace-store"

export type DashboardRecord = {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

type DashboardDataContextValue = {
  records: DashboardRecord[]
  addRecord: (record: Omit<DashboardRecord, "id">) => void
  updateRecord: (id: number, record: Omit<DashboardRecord, "id">) => void
  deleteRecord: (id: number) => void
  resetRecords: () => void
}

const STORAGE_KEY = "dashboard-records-v1"
const MOCK_URL = "/mock/dashboard-records.json"

const DashboardDataContext = React.createContext<DashboardDataContextValue | null>(
  null
)

function isDashboardRecordArray(value: unknown): value is DashboardRecord[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as DashboardRecord).id === "number" &&
      typeof (item as DashboardRecord).header === "string" &&
      typeof (item as DashboardRecord).type === "string" &&
      typeof (item as DashboardRecord).status === "string" &&
      typeof (item as DashboardRecord).target === "string" &&
      typeof (item as DashboardRecord).limit === "string" &&
      typeof (item as DashboardRecord).reviewer === "string"
  )
}

export function DashboardDataProvider({
  initialRecords = [],
  children,
}: {
  initialRecords?: DashboardRecord[]
  children: React.ReactNode
}) {
  const [records, setRecords] = React.useState<DashboardRecord[]>(initialRecords)
  const baselineRef = React.useRef<DashboardRecord[]>(initialRecords)
  const pushActivity = useWorkspaceStore((state) => state.pushActivity)
  const pushNotification = useWorkspaceStore((state) => state.pushNotification)

  React.useEffect(() => {
    let isMounted = true

    async function loadRecords() {
      let hasLocalData = false

      try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed: unknown = JSON.parse(saved)
          if (isDashboardRecordArray(parsed)) {
            if (parsed.length > 0) {
              hasLocalData = true
              if (isMounted) {
                setRecords(parsed)
              }
            }
          }
        }
      } catch {
        // Ignore malformed local data.
      }

      try {
        const response = await fetch(MOCK_URL, { cache: "no-store" })
        if (!response.ok) return
        const json: unknown = await response.json()
        if (!isDashboardRecordArray(json)) return

        baselineRef.current = json
        if (!hasLocalData && isMounted) {
          setRecords(json)
        }
      } catch {
        // Keep current fallback records.
      }
    }

    loadRecords()
    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const addRecord = React.useCallback((record: Omit<DashboardRecord, "id">) => {
    setRecords((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((item) => item.id)) + 1 : 1
      return [...prev, { id: nextId, ...record }]
    })
    pushActivity(`已创建记录「${record.header}」`, "records")
  }, [pushActivity])

  const updateRecord = React.useCallback(
    (id: number, record: Omit<DashboardRecord, "id">) => {
      setRecords((prev) =>
        prev.map((item) => (item.id === id ? { id: item.id, ...record } : item))
      )
      pushActivity(`已更新记录 #${id}（${record.header}）`, "records")
    },
    [pushActivity]
  )

  const deleteRecord = React.useCallback((id: number) => {
    setRecords((prev) => prev.filter((item) => item.id !== id))
    pushActivity(`已删除记录 #${id}`, "records")
    pushNotification("记录已删除", `记录 #${id} 已被移除`, "medium")
  }, [pushActivity, pushNotification])

  const resetRecords = React.useCallback(() => {
    setRecords(baselineRef.current)
    pushActivity("已重置记录到 Mock 基线数据", "records")
    pushNotification("记录已重置", "仪表盘记录已回退到 Mock 基线", "low")
  }, [pushActivity, pushNotification])

  const value = React.useMemo(
    () => ({ records, addRecord, updateRecord, deleteRecord, resetRecords }),
    [records, addRecord, updateRecord, deleteRecord, resetRecords]
  )

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  )
}

export function useDashboardData() {
  const context = React.useContext(DashboardDataContext)
  if (!context) {
    throw new Error("useDashboardData must be used within DashboardDataProvider")
  }
  return context
}
