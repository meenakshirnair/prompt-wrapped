import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { TopicCount } from "../../types"

interface Props {
  data: TopicCount[]
}

// Assign a distinct color per topic for visual variety.
const TOPIC_COLORS: Record<string, string> = {
  coding: "#a855f7",
  career: "#ec4899",
  writing: "#f59e0b",
  data: "#10b981",
  learning: "#3b82f6",
  planning: "#f97316",
  personal: "#8b5cf6",
  other: "#64748b",
}

export function TopicChart({ data }: Props) {
  if (data.length === 0) {
    return null
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-1">What you use AI for</h3>
      <p className="text-xs text-slate-500 mb-4">Based on keywords in your messages</p>

      <ResponsiveContainer width="100%" height={data.length * 44 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="label"
            type="category"
            stroke="#cbd5e1"
            fontSize={13}
            tickLine={false}
            axisLine={false}
            width={150}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            formatter={(value, _name, entry) => {
            const pct = (entry.payload as TopicCount).percentage.toFixed(1)
            return [`${value} messages (${pct}%)`, "Count"]
            }}
            cursor={{ fill: "#334155", opacity: 0.3 }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{
            position: "right",
            fill: "#94a3b8",
            fontSize: 12,
            formatter: (value) => String(value),
          }}>
            {data.map((entry, index) => (
              <Cell key={index} fill={TOPIC_COLORS[entry.topic] ?? "#64748b"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}