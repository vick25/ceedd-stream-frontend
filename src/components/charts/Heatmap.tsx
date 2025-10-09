"use client";
import { Infrastructure } from "@/types/infrastructure"

interface HeatmapProps {
  infrastructures: Infrastructure[];
  title?: string;
}

export function Heatmap({ infrastructures, title }: HeatmapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "bad":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {infrastructures.map((infra) => (
          <div
            key={infra.id}
            className={`p-2 rounded text-white text-xs ${getStatusColor(
              infra.status
            )}`}
            title={`${infra.name} - ${infra.type} - ${infra.status}`}
          >
            {infra.name}
          </div>
        ))}
      </div>
    </div>
  );
}
