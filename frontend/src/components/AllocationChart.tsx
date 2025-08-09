import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

interface Bucket {
  value: number;
  percentage: number;
}
interface Props {
  sectorData: Record<string, Bucket>;
  marketCapData: Record<string, Bucket>;
}

const colorPool = [
  "#4cafef",
  "#ff9800",
  "#8bc34a",
  "#f44336",
  "#9c27b0",
  "#03a9f4",
  "#795548",
  "#e91e63",
  "#009688",
];

function useLegendPosition() {
  const [pos, setPos] = useState<"right" | "bottom">(
    window.innerWidth >= 768 ? "right" : "bottom"
  );
  useEffect(() => {
    const onResize = () =>
      setPos(window.innerWidth >= 768 ? "right" : "bottom");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return pos;
}

const SmallPie: React.FC<{ data: Record<string, Bucket>; title: string }> = ({
  data,
  title,
}) => {
  const labels = Object.keys(data);
  const values = labels.map((l) => data[l].value);
  const legendPos = useLegendPosition();

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="flex justify-center">
        <div className="w-full max-w-xs md:max-w-sm">
          <Pie
            data={{
              labels,
              datasets: [
                {
                  data: values,
                  backgroundColor: labels.map(
                    (_, i) => colorPool[i % colorPool.length]
                  ),
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: legendPos,
                  labels: {
                    boxWidth: 12,
                    font: { size: 11 },
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx: TooltipItem<"pie">) => {
                      const v = (ctx.raw as number) ?? 0;
                      const pct =
                        data[ctx.label as keyof typeof data]?.percentage ?? 0;
                      return `${ctx.label}: ₹${v.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })} (${pct.toFixed(2)}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const AllocationCharts: React.FC<Props> = ({ sectorData, marketCapData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SmallPie data={sectorData} title="Sector Distribution" />
      <SmallPie data={marketCapData} title="Market Cap Distribution" />
    </div>
  );
};

export default AllocationCharts;
