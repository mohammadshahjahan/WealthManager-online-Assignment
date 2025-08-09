import React, { useMemo, useState } from "react";
import { type Holding } from "../api/portfolio";

type SortKey = keyof Holding | "gainLossPercent" | "value" | "symbol";

interface Props {
  holdings: Holding[];
}

const formatMoney = (n: number) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

const HoldingsTable: React.FC<Props> = ({ holdings }) => {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [asc, setAsc] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = holdings.filter(
      (h) =>
        h.symbol.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        h.sector.toLowerCase().includes(q)
    );
    arr = arr.sort((a, b) => {
      const aVal = a[sortKey as keyof Holding] as number | string;
      const bVal = b[sortKey as keyof Holding] as number | string;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return asc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    return arr;
  }, [holdings, query, sortKey, asc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, name or sector..."
            className="px-3 py-2 border rounded-md text-sm w-64 focus:outline-none"
          />
          <button
            onClick={() => {
              setQuery("");
            }}
            className="text-sm text-gray-500"
          >
            Clear
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filtered.length} holdings
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>
              <th
                className="px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("symbol")}
              >
                Symbol
              </th>
              <th className="px-3 py-2 text-left">Name</th>
              <th
                className="px-3 py-2 text-right cursor-pointer"
                onClick={() => toggleSort("quantity")}
              >
                Qty
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer"
                onClick={() => toggleSort("avgPrice")}
              >
                Avg
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer"
                onClick={() => toggleSort("currentPrice")}
              >
                LTP
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer"
                onClick={() => toggleSort("value")}
              >
                Value
              </th>
              <th
                className="px-3 py-2 text-right cursor-pointer"
                onClick={() => toggleSort("gainLossPercent")}
              >
                Gain %
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h.symbol + h.name} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{h.symbol}</td>
                <td className="px-3 py-2">{h.name}</td>
                <td className="px-3 py-2 text-right">{h.quantity}</td>
                <td className="px-3 py-2 text-right">
                  ₹{formatMoney(h.avgPrice)}
                </td>
                <td className="px-3 py-2 text-right">
                  ₹{formatMoney(h.currentPrice)}
                </td>
                <td className="px-3 py-2 text-right">
                  ₹{formatMoney(h.value)}
                </td>
                <td
                  className={`px-3 py-2 text-right font-semibold ${
                    h.gainLossPercent >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {h.gainLossPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
