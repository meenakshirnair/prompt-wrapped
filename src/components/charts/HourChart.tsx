import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts"
import type { HourlyCount } from "../../types"

interface Props {
  data: HourlyCount[]
}

export function HourChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    label: formatHour(d.hour),
  }))

  // Find max to color peak hours differently
  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-1">Hour of day</h3>
      <p className="text-xs text-slate-500 mb-4">When you chat the most</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
            itemStyle={{ color: "#a855f7" }}
            cursor={{ fill: "#334155", opacity: 0.3 }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {formatted.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.count === maxCount ? "#ec4899" : "#a855f7"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatHour(hour: number): string {
  if (hour === 0) return "12a"
  if (hour === 12) return "12p"
  if (hour < 12) return `${hour}a`
  return `${hour - 12}p`
}