import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import type { DailyCount } from "../../types"

interface Props {
  data: DailyCount[]
}

export function ActivityChart({ data }: Props) {
  // Format dates for display (e.g. "Apr 17")
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h3 className="text-sm uppercase tracking-wide text-slate-400 mb-1">Activity over time</h3>
      <p className="text-xs text-slate-500 mb-4">Messages per day</p>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
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
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#activityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}