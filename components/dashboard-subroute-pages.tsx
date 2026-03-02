"use client"

import * as React from "react"
import {
  IconEdit,
  IconMail,
  IconPhone,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconUserPlus,
} from "@tabler/icons-react"

import { useDashboardData } from "@/components/dashboard-data-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PersonnelStatus = "在岗" | "请假" | "离岗"

type PersonnelRecord = {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string
  status: PersonnelStatus
  joinedAt: string
}

type PersonnelForm = Omit<PersonnelRecord, "id">

type HelpTicket = {
  id: string
  title: string
  priority: "高" | "中" | "低"
  status: "待处理" | "处理中" | "已解决"
  owner: string
}

const PERSONNEL_STORAGE_KEY = "dashboard-personnel-v1"
const PERSONNEL_MOCK_URL = "/mock/personnel.json"
const HELP_TICKETS_MOCK_URL = "/mock/help-tickets.json"

const emptyPersonnelForm: PersonnelForm = {
  name: "",
  role: "前端工程师",
  department: "研发部",
  email: "",
  phone: "",
  status: "在岗",
  joinedAt: "",
}

function isPersonnelList(value: unknown): value is PersonnelRecord[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as PersonnelRecord).id === "number" &&
      typeof (item as PersonnelRecord).name === "string"
  )
}

function isHelpTicketList(value: unknown): value is HelpTicket[] {
  if (!Array.isArray(value)) return false
  return value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as HelpTicket).id === "string" &&
      typeof (item as HelpTicket).title === "string"
  )
}

function statusBadge(status: PersonnelStatus) {
  if (status === "在岗") {
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">在岗</Badge>
  }
  if (status === "请假") {
    return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">请假</Badge>
  }
  return <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200">离岗</Badge>
}

function getInitials(name: string) {
  const n = name.trim()
  return n.length > 2 ? n.slice(-2) : n || "成员"
}

export function PersonnelManagementPageContent() {
  const [records, setRecords] = React.useState<PersonnelRecord[]>([])
  const [keyword, setKeyword] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"全部" | PersonnelStatus>("全部")
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState<PersonnelForm>(emptyPersonnelForm)
  const baselineRef = React.useRef<PersonnelRecord[]>([])

  React.useEffect(() => {
    let isMounted = true

    async function load() {
      let hasLocal = false
      try {
        const saved = window.localStorage.getItem(PERSONNEL_STORAGE_KEY)
        if (saved) {
          const parsed: unknown = JSON.parse(saved)
          if (isPersonnelList(parsed)) {
            if (parsed.length > 0) {
              hasLocal = true
              if (isMounted) setRecords(parsed)
            }
          }
        }
      } catch {
        // Ignore malformed local data.
      }

      try {
        const response = await fetch(PERSONNEL_MOCK_URL, { cache: "no-store" })
        if (!response.ok) return
        const json: unknown = await response.json()
        if (!isPersonnelList(json)) return
        baselineRef.current = json
        if (!hasLocal && isMounted) {
          setRecords(json)
        }
      } catch {
        // Keep current records.
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem(PERSONNEL_STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const filteredRecords = React.useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return records.filter((item) => {
      const matchKeyword =
        !q ||
        `${item.name} ${item.role} ${item.department} ${item.email} ${item.phone}`
          .toLowerCase()
          .includes(q)
      const matchStatus = statusFilter === "全部" || item.status === statusFilter
      return matchKeyword && matchStatus
    })
  }, [keyword, records, statusFilter])

  const metrics = React.useMemo(() => {
    const total = records.length
    const active = records.filter((item) => item.status === "在岗").length
    const leave = records.filter((item) => item.status === "请假").length
    const deptCount = new Set(records.map((item) => item.department)).size
    return { total, active, leave, deptCount }
  }, [records])

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyPersonnelForm)
  }

  const resetPersonnel = () => {
    setRecords(baselineRef.current)
    resetForm()
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return

    const payload: PersonnelForm = {
      ...form,
      joinedAt: form.joinedAt || new Date().toISOString().slice(0, 10),
    }

    if (editingId === null) {
      const nextId = records.length > 0 ? Math.max(...records.map((item) => item.id)) + 1 : 1
      setRecords((prev) => [...prev, { id: nextId, ...payload }])
    } else {
      setRecords((prev) =>
        prev.map((item) => (item.id === editingId ? { id: item.id, ...payload } : item))
      )
    }

    resetForm()
  }

  const startEdit = (record: PersonnelRecord) => {
    setEditingId(record.id)
    setForm({
      name: record.name,
      role: record.role,
      department: record.department,
      email: record.email,
      phone: record.phone,
      status: record.status,
      joinedAt: record.joinedAt,
    })
  }

  const removeRecord = (id: number) => {
    setRecords((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">成员总数</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">在岗成员</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">请假成员</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.leave}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">部门数量</p>
            <p className="mt-1 text-2xl font-semibold">{metrics.deptCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <IconUserPlus className="size-4" />
            {editingId === null ? "新增人员" : "编辑人员"}
          </CardTitle>
          <Button type="button" variant="outline" onClick={resetPersonnel}>
            <IconRefresh />
            重置模拟数据
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pm-name">姓名</Label>
              <Input
                id="pm-name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="请输入姓名"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pm-role">岗位</Label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger id="pm-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="产品经理">产品经理</SelectItem>
                  <SelectItem value="前端工程师">前端工程师</SelectItem>
                  <SelectItem value="后端工程师">后端工程师</SelectItem>
                  <SelectItem value="测试工程师">测试工程师</SelectItem>
                  <SelectItem value="UI 设计师">UI 设计师</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pm-dept">部门</Label>
              <Input
                id="pm-dept"
                value={form.department}
                onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                placeholder="例如：研发部"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pm-status">状态</Label>
              <Select
                value={form.status}
                onValueChange={(value: PersonnelStatus) =>
                  setForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="pm-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="在岗">在岗</SelectItem>
                  <SelectItem value="请假">请假</SelectItem>
                  <SelectItem value="离岗">离岗</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pm-email">邮箱</Label>
              <Input
                id="pm-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@company.com"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pm-phone">手机号</Label>
              <Input
                id="pm-phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="13800000000"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="pm-joined">入职日期</Label>
              <Input
                id="pm-joined"
                type="date"
                value={form.joinedAt}
                onChange={(e) => setForm((prev) => ({ ...prev, joinedAt: e.target.value }))}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="w-full">
                <IconPlus />
                {editingId === null ? "新增人员" : "保存修改"}
              </Button>
              {editingId !== null && (
                <Button type="button" variant="outline" className="w-full" onClick={resetForm}>
                  取消
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">人员列表</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-72">
              <IconSearch className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
              <Input
                className="pl-8"
                placeholder="搜索姓名/岗位/部门/邮箱/手机号"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: "全部" | PersonnelStatus) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部状态</SelectItem>
                <SelectItem value="在岗">在岗</SelectItem>
                <SelectItem value="请假">请假</SelectItem>
                <SelectItem value="离岗">离岗</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>成员</TableHead>
                  <TableHead>岗位 / 部门</TableHead>
                  <TableHead>联系方式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>入职日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-20 text-center">
                      没有匹配到人员
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="bg-muted flex size-9 items-center justify-center rounded-full text-xs font-medium">
                            {getInitials(item.name)}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground text-xs">ID #{item.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{item.role}</p>
                        <p className="text-muted-foreground text-xs">{item.department}</p>
                      </TableCell>
                      <TableCell>
                        <p className="flex items-center gap-1.5 text-sm">
                          <IconMail className="text-muted-foreground size-3.5" />
                          {item.email}
                        </p>
                        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                          <IconPhone className="size-3.5" />
                          {item.phone || "-"}
                        </p>
                      </TableCell>
                      <TableCell>{statusBadge(item.status)}</TableCell>
                      <TableCell>{item.joinedAt || "-"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => startEdit(item)}>
                            <IconEdit />
                            编辑
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => removeRecord(item.id)}>
                            <IconTrash />
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsPageContent() {
  const [name, setName] = React.useState("张三")
  const [email, setEmail] = React.useState("zhangsan@example.com")
  const [language, setLanguage] = React.useState("zh-CN")
  const [systemNotice, setSystemNotice] = React.useState(true)
  const [weeklySummary, setWeeklySummary] = React.useState(true)
  const [riskAlert, setRiskAlert] = React.useState(false)

  return (
    <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>账户设置</CardTitle>
          <CardDescription>维护账户信息和展示偏好。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="setting-name">姓名</Label>
            <Input id="setting-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="setting-email">邮箱</Label>
            <Input id="setting-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="setting-language">语言</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="setting-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-CN">简体中文</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="button">保存账户设置</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知设置</CardTitle>
          <CardDescription>配置接收消息的方式和优先级。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="flex items-center gap-3">
            <Checkbox checked={systemNotice} onCheckedChange={(v) => setSystemNotice(v === true)} />
            <span className="text-sm">系统公告通知</span>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox checked={weeklySummary} onCheckedChange={(v) => setWeeklySummary(v === true)} />
            <span className="text-sm">每周项目摘要</span>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox checked={riskAlert} onCheckedChange={(v) => setRiskAlert(v === true)} />
            <span className="text-sm">风险告警即时提醒</span>
          </label>
          <div>
            <Button type="button" variant="outline">
              保存通知设置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function HelpPageContent() {
  const [tickets, setTickets] = React.useState<HelpTicket[]>([])

  React.useEffect(() => {
    let isMounted = true
    async function loadTickets() {
      try {
        const response = await fetch(HELP_TICKETS_MOCK_URL, { cache: "no-store" })
        if (!response.ok) return
        const json: unknown = await response.json()
        if (!isHelpTicketList(json)) return
        if (isMounted) {
          setTickets(json)
        }
      } catch {
        // Keep empty list on fetch error.
      }
    }
    loadTickets()
    return () => {
      isMounted = false
    }
  }, [])

  const faq = [
    {
      q: "如何新增成员？",
      a: "进入“人员管理”，填写表单后点击“新增人员”即可新增。",
    },
    {
      q: "为什么团队成员页不能编辑？",
      a: "“团队成员”是只读页，用于展示成员信息；编辑请在“人员管理”中进行。",
    },
    {
      q: "如何恢复模拟数据？",
      a: "人员管理页点击“重置模拟数据”即可恢复 public/mock 内的默认数据。",
    },
  ]

  return (
    <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>使用指引</CardTitle>
          <CardDescription>推荐按以下顺序完成日常管理。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div className="rounded-md border p-3">1. 在“人员管理”维护成员信息。</div>
          <div className="rounded-md border p-3">2. 在“团队成员”查看只读名单。</div>
          <div className="rounded-md border p-3">3. 在“搜索”快速定位目标记录。</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>常见问题</CardTitle>
          <CardDescription>遇到问题可先查看下面的 FAQ。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {faq.map((item) => (
            <div key={item.q} className="rounded-md border p-3">
              <p className="font-medium">{item.q}</p>
              <p className="text-muted-foreground mt-1 text-sm">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>测试数据</CardTitle>
          <CardDescription>来自 `public/mock/help-tickets.json` 的模拟工单。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工单号</TableHead>
                  <TableHead>问题标题</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>负责人</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground h-20 text-center">
                      暂无测试数据
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.status}</Badge>
                      </TableCell>
                      <TableCell>{ticket.owner}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SearchPageContent() {
  const { records } = useDashboardData()
  const [keyword, setKeyword] = React.useState("")

  const results = React.useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return records
    return records.filter((item) =>
      `${item.header} ${item.type} ${item.status} ${item.reviewer}`.toLowerCase().includes(q)
    )
  }, [records, keyword])

  return (
    <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>全局搜索</CardTitle>
          <CardDescription>按标题、类型、状态、负责人检索项目数据。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            placeholder="输入关键词，例如：技术方案 / 王雪 / 进行中"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <div className="text-muted-foreground text-sm">共匹配 {results.length} 条记录</div>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>负责人</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground h-20 text-center">
                      没有匹配结果
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.header}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.status}</Badge>
                      </TableCell>
                      <TableCell>{item.reviewer}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function TeamMembersReadOnlyPageContent() {
  const { records } = useDashboardData()

  const members = React.useMemo(() => {
    const map = new Map<string, { name: string; taskCount: number; activeCount: number }>()

    for (const record of records) {
      const name = record.reviewer?.trim() || "待分配"
      if (name === "待分配") continue

      const current = map.get(name) ?? { name, taskCount: 0, activeCount: 0 }
      current.taskCount += 1
      if (record.status === "进行中") {
        current.activeCount += 1
      }
      map.set(name, current)
    }

    return Array.from(map.values()).sort((a, b) => b.taskCount - a.taskCount)
  }, [records])

  return (
    <div className="grid gap-4 px-4 py-4 md:px-6 md:py-6">
      <Card>
        <CardHeader>
          <CardTitle>团队成员</CardTitle>
          <CardDescription>只读展示成员和当前任务情况。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>成员</TableHead>
                  <TableHead>负责任务数</TableHead>
                  <TableHead>进行中任务</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground h-20 text-center">
                      暂无成员数据
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.name}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.taskCount}</TableCell>
                      <TableCell>{member.activeCount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.activeCount > 0 ? "在岗" : "空闲"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
