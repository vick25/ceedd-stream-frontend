"use client"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BarChartProps {
  data: Array<Record<string, any>>
  title?: string
  height?: number
  xAxisKey: string
  bars: Array<{ dataKey: string; fill: string; name: string }>
}

export function BarChart({ data, title, height = 300, xAxisKey, bars }: BarChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {bars.map((bar) => (
            <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
