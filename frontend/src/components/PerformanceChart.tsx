import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

import { type TimelinePoint } from "../api/portfolio";

interface Props {
  timeline: TimelinePoint[];
  returns: Record<string, Record<string, number>>;
}

const PerformanceChart: React.FC<Props> = ({ timeline, returns }) => {
  const labels = timeline.map((t) => t.date);
  const pf = timeline.map((t) => t.portfolio);
  const nifty = timeline.map((t) => t.nifty50);
  const gold = timeline.map((t) => t.gold);

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Performance Comparison</h3>
      <div className="w-full overflow-x-auto">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Portfolio",
                data: pf,
                borderColor: "#10b981",
                backgroundColor: "rgba(16,185,129,0.08)",
                tension: 0.2,
                fill: true,
              },
              {
                label: "Nifty50",
                data: nifty,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.06)",
                tension: 0.2,
                fill: true,
              },
              {
                label: "Gold",
                data: gold,
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245,158,11,0.06)",
                tension: 0.2,
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
              legend: { position: "top" },
              tooltip: { mode: "index", intersect: false },
            },
            scales: {
              y: {
                ticks: {
                  callback: (val: string | number) => {
                    if (typeof val === "number") {
                      return `₹${val.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}`;
                    }
                    return val;
                  },
                },
              },
            },
          }}
          height={300}
        />
      </div>

      {/* returns summary */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: "1month", label: "1 Month" },
          { key: "3months", label: "3 Months" },
          { key: "1year", label: "1 Year" },
        ].map((r) => (
          <div key={r.key} className="bg-gray-50 p-3 rounded">
            <div className="text-xs text-gray-500">{r.label}</div>
            <div className="text-lg font-semibold">
              Portfolio: {returns?.portfolio?.[r.key] ?? "-"}%
            </div>
            <div className="text-sm text-gray-600">
              Nifty: {returns?.nifty50?.[r.key] ?? "-"}%
            </div>
            <div className="text-sm text-gray-600">
              Gold: {returns?.gold?.[r.key] ?? "-"}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
