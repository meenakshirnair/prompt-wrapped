import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { TopicCount } from "../../types"
import { ChartFrame } from "./ChartFrame"

interface Props {
  data: TopicCount[]
}

export function TopicChart({ data }: Props) {
  if (data.length === 0) return null

  const sorted = [...data].sort((a, b) => b.count - a.count)
  const topTopic = sorted[0]?.topic

  return (
    <ChartFrame
      kicker="Fig. 02"
      title="What you used it for"
      note="Topics, extracted by keyword from your own words."
    >
      <ResponsiveContainer width="100%" height={sorted.length * 46 + 20}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 64, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="label"
            type="category"
            stroke="currentColor"
            strokeOpacity={0.35}
            tick={{ fill: "currentColor", fillOpacity: 0.75, fontSize: 13, fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
            tickLine={false}
            axisLine={false}
            width={160}
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
            formatter={(value, _name, entry) => {
              const pct = (entry.payload as TopicCount).percentage.toFixed(1)
              return [`${value} messages · ${pct}%`, "Count"]
            }}
          />
          <Bar dataKey="count" label={{ position: "right", fill: "currentColor", fontSize: 11, fontFamily: "ui-monospace, monospace", formatter: (v) => String(v) }}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={entry.topic === topTopic ? "#ff5722" : "currentColor"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  )
}