"use client"

import * as React from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { useDashboardData } from "@/components/dashboard-data-provider"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function toNumber(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function TrendBadge({ value }: { value: number }) {
  const isUp = value >= 0
  const Icon = isUp ? IconTrendingUp : IconTrendingDown
  return (
    <Badge variant="outline">
      <Icon />
      {isUp ? "+" : ""}
      {value.toFixed(1)}%
    </Badge>
  )
}

export function SectionCards() {
  const { records } = useDashboardData()

  const metrics = React.useMemo(() => {
    const totalTarget = records.reduce((sum, item) => sum + toNumber(item.target), 0)
    const totalLimit = records.reduce((sum, item) => sum + toNumber(item.limit), 0)
    const inProgress = records.filter((item) => item.status === "进行中").length
    const done = records.filter((item) => item.status === "已完成").length
    const activeAccounts = new Set(
      records
        .map((item) => item.reviewer?.trim())
        .filter((name) => name && name !== "待分配")
    ).size

    const revenue = totalTarget * 1000
    const growthRate = totalLimit > 0 ? ((totalTarget - totalLimit) / totalLimit) * 100 : 0
    const newCustomerRate = records.length > 0 ? (inProgress / records.length) * 100 : 0
    const activeRate = records.length > 0 ? (done / records.length) * 100 : 0

    return {
      revenue,
      growthRate,
      inProgress,
      newCustomerRate,
      activeAccounts,
      activeRate,
    }
  }, [records])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>总收入</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${metrics.revenue.toLocaleString()}
          </CardTitle>
          <CardAction>
            <TrendBadge value={metrics.growthRate} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">计算公式：sum(目标收入) * 1000</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>新增客户</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.inProgress}
          </CardTitle>
          <CardAction>
            <TrendBadge value={metrics.newCustomerRate} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">按“进行中”记录数统计</div>
          <div className="text-muted-foreground">占全部记录 {metrics.newCustomerRate.toFixed(1)}%</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>活跃账户</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeAccounts}
          </CardTitle>
          <CardAction>
            <TrendBadge value={metrics.activeRate} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">按负责人去重统计</div>
          <div className="text-muted-foreground">不含“待分配”</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>增长率</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.growthRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <TrendBadge value={metrics.growthRate} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">计算公式：(目标收入-收入上限)/收入上限</div>
        </CardFooter>
      </Card>
    </div>
  )
}
