import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { DailyCount } from "../../types"
import { ChartFrame } from "./ChartFrame"

interface Props {
  data: DailyCount[]
}

export function ActivityChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <ChartFrame
      kicker="Fig. 01"
      title="Activity over time"
      note="Messages sent each day. Every spike is a burst of curiosity."
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.18} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="currentColor" strokeOpacity={0.12} vertical={false} />
          <XAxis
            dataKey="label"
            stroke="currentColor"
            strokeOpacity={0.35}
            tick={{ fill: "currentColor", fillOpacity: 0.55, fontSize: 10, fontFamily: "ui-monospace, monospace" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={60}
          />
          <YAxis
            stroke="currentColor"
            strokeOpacity={0.35}
            tick={{ fill: "currentColor", fillOpacity: 0.55, fontSize: 10, fontFamily: "ui-monospace, monospace" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#faf8f3",
              border: "1px solid #1a1a1a",
              borderRadius: 0,
              fontSize: 12,
              fontFamily: "ui-monospace, monospace",
              padding: "6px 10px",
            }}
            labelStyle={{ color: "#1a1a1a", fontWeight: 500 }}
            itemStyle={{ color: "#1a1a1a" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="currentColor"
            strokeWidth={1.5}
            fill="url(#activityFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}