import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { HourlyCount } from "../../types"
import { ChartFrame } from "./ChartFrame"

interface Props {
  data: HourlyCount[]
}

export function HourChart({ data }: Props) {
  const formatted = data.map(d => ({ ...d, label: formatHour(d.hour) }))
  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <ChartFrame kicker="Fig. 03" title="Your hours" note="When, in the day, you reach for help.">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="label"
            stroke="currentColor"
            strokeOpacity={0.35}
            tick={{ fill: "currentColor", fillOpacity: 0.55, fontSize: 10, fontFamily: "ui-monospace, monospace" }}
            tickLine={false}
            axisLine={false}
            interval={1}
          />
          <YAxis
            stroke="currentColor"
            strokeOpacity={0.35}
            tick={{ fill: "currentColor", fillOpacity: 0.55, fontSize: 10, fontFamily: "ui-monospace, monospace" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
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
          <Bar dataKey="count">
            {formatted.map((entry, i) => (
              <Cell key={i} fill={entry.count === maxCount ? "#ff5722" : "currentColor"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}

function formatHour(h: number): string {
  if (h === 0) return "12am"
  if (h === 12) return "12pm"
  if (h < 12) return `${h}am`
  return `${h - 12}pm`
}