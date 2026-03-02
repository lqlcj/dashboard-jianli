"use client"

import * as React from "react"
import { IconEdit, IconPlus, IconRefresh, IconSearch, IconTrash } from "@tabler/icons-react"

import { type DashboardRecord, useDashboardData } from "@/components/dashboard-data-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusOptions = ["已完成", "进行中", "未开始"] as const
const typeOptions = ["封面", "叙述", "技术方案", "设计", "重点文档", "执行摘要", "目录", "能力说明"] as const
const reviewerOptions = ["王雪", "李航", "周宁", "待分配"] as const

type FormState = Omit<DashboardRecord, "id">

const emptyForm: FormState = {
  header: "",
  type: "技术方案",
  status: "未开始",
  target: "",
  limit: "",
  reviewer: "待分配",
}

function StatusBadge({ status }: { status: string }) {
  const isDone = status === "已完成"
  return (
    <Badge variant="outline" className={isDone ? "text-green-600" : ""}>
      {status}
    </Badge>
  )
}

export function DataTable() {
  const { records, addRecord, updateRecord, deleteRecord, resetRecords } = useDashboardData()

  const [keyword, setKeyword] = React.useState("")
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [isEditorOpen, setIsEditorOpen] = React.useState(false)

  const filteredRecords = React.useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return records

    return records.filter((item) =>
      `${item.header} ${item.type} ${item.status} ${item.reviewer}`.toLowerCase().includes(q)
    )
  }, [records, keyword])

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsEditorOpen(true)
  }

  const startEdit = (record: DashboardRecord) => {
    setEditingId(record.id)
    setForm({
      header: record.header,
      type: record.type,
      status: record.status,
      target: record.target,
      limit: record.limit,
      reviewer: record.reviewer,
    })
    setIsEditorOpen(true)
  }

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.header.trim()) return

    if (editingId === null) {
      addRecord(form)
    } else {
      updateRecord(editingId, form)
    }

    setEditingId(null)
    setForm(emptyForm)
    setIsEditorOpen(false)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>项目模板管理</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-72">
              <IconSearch className="text-muted-foreground pointer-events-none absolute top-2.5 left-2.5 size-4" />
              <Input
                className="pl-8"
                placeholder="搜索标题/类型/状态/负责人"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <Button type="button" variant="outline" onClick={startCreate}>
              <IconPlus />
              新增
            </Button>
            <Button type="button" variant="outline" onClick={resetRecords}>
              <IconRefresh />
              重置
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>目标收入</TableHead>
                  <TableHead>收入上限</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground h-20 text-center">
                      没有匹配的数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{record.header}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>{record.target}</TableCell>
                      <TableCell>{record.limit}</TableCell>
                      <TableCell>{record.reviewer}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => startEdit(record)}>
                            <IconEdit />
                            编辑
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => deleteRecord(record.id)}>
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

      <Sheet open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editingId === null ? "新增项目模板" : "编辑项目模板"}</SheetTitle>
            <SheetDescription>在弹出卡片中维护模板数据，保存后会实时刷新仪表盘指标。</SheetDescription>
          </SheetHeader>

          <form onSubmit={submitForm} className="grid gap-3 px-4 pb-4">
            <div className="grid gap-1.5">
              <Label>标题</Label>
              <Input
                value={form.header}
                onChange={(event) => setForm((prev) => ({ ...prev, header: event.target.value }))}
                placeholder="请输入模块标题"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label>类型</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>状态</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>目标收入</Label>
                <Input
                  value={form.target}
                  onChange={(event) => setForm((prev) => ({ ...prev, target: event.target.value }))}
                  inputMode="numeric"
                />
              </div>
              <div className="grid gap-1.5">
                <Label>收入上限</Label>
                <Input
                  value={form.limit}
                  onChange={(event) => setForm((prev) => ({ ...prev, limit: event.target.value }))}
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>负责人</Label>
              <Select
                value={form.reviewer}
                onValueChange={(value) => setForm((prev) => ({ ...prev, reviewer: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reviewerOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <SheetFooter className="px-0">
              <Button type="submit">{editingId === null ? "创建模板" : "保存修改"}</Button>
              <Button type="button" variant="outline" onClick={closeEditor}>
                取消
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
