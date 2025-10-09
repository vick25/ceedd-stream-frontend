"use client";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { Infrastructure } from "@/types/infrastructure";
interface PieChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  title?: string;
  height?: number;
}

interface BarChartProps {
  data: Array<Record<string, any>>;
  title?: string;
  height?: number;
  xAxisKey: string;
  bars: Array<{ dataKey: string; fill: string; name: string }>;
}
export function PieChart({ data, title, height = 300 }: PieChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${((percent as number) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
