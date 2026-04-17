import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts"
import type { WeekdayCount } from "../../types"

interface Props {
  data: WeekdayCount[]
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function WeekdayChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    label: DAY_LABELS[d.day],
  }))

  const maxCount = Math.max(...data.map(d => d.count))

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-1">Day of week</h3>
      <p className="text-xs text-slate-500 mb-4">Your weekly rhythm</p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
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