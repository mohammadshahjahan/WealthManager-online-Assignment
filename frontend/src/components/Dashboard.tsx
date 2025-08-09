import React, { useEffect, useState } from "react";
import {
  getAllocation,
  getHoldings,
  getPerformance,
  getSummary,
  type AllocationResponse,
  type Holding,
  type PerformanceResponse,
  type SummaryResponse,
} from "../api/portfolio";
import HoldingsTable from "./HoldingsTable";
import PerformanceChart from "./PerformanceChart";
import TopPerformers from "./TopPerformers";
import AllocationCharts from "./AllocationChart";

const Dashboard: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [allocation, setAllocation] = useState<AllocationResponse | null>(null);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      getHoldings(),
      getAllocation(),
      getSummary(),
      getPerformance(),
    ])
      .then(([h, a, s, p]) => {
        setHoldings(h);
        setAllocation(a);
        setSummary(s);
        setPerformance(p);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Failed to fetch portfolio data. Make sure backend is running on http://localhost:8080"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
          <div className="h-64 bg-gray-200 rounded" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !summary || !allocation || !performance) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          {error ?? "Data unavailable."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
        <div className="text-sm text-gray-500">
          Connected to backend: http://localhost:8080
        </div>
      </header>

      {/* top row: big total + small cards + allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total Portfolio Value</div>
            <div className="mt-2 text-4xl font-extrabold">
              ₹{summary.totalValue.toLocaleString()}
            </div>
            <div className="mt-4 flex gap-3">
              <div
                className={`px-3 py-2 rounded ${
                  summary.totalGainLoss >= 0
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <div className="text-xs">Total Gain/Loss</div>
                <div className="font-semibold">
                  ₹{summary.totalGainLoss.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded bg-gray-50">
                <div className="text-xs">Performance %</div>
                <div className="font-semibold">
                  {summary.totalGainLossPercent}%
                </div>
              </div>
              <div className="px-3 py-2 rounded bg-gray-50">
                <div className="text-xs">Holdings</div>
                <div className="font-semibold">{holdings.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <AllocationCharts
            sectorData={allocation.bySector}
            marketCapData={allocation.byMarketCap}
          />
        </div>
      </div>

      {/* Top performers */}
      <TopPerformers summary={summary} holdingsCount={holdings.length} />

      {/* performance chart */}
      <PerformanceChart
        timeline={performance.timeline}
        returns={performance.returns}
      />

      {/* holdings table */}
      <HoldingsTable holdings={holdings} />
    </div>
  );
};

export default Dashboard;
