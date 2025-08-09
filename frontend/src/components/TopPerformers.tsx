import { type SummaryResponse } from "../api/portfolio";

interface Props {
  summary: SummaryResponse;
  holdingsCount: number;
}

const TopPerformers: React.FC<Props> = ({ summary, holdingsCount }) => {
  const top = summary.topPerformer;
  const worst = summary.worstPerformer;
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Top Performers & Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Best Performer</div>
          {top ? (
            <div className="mt-2">
              <div className="font-bold">
                {top.symbol} — {top.name}
              </div>
              <div className="text-green-600 font-semibold mt-1">
                {top.gainLossPercent}%
              </div>
              <div className="text-sm text-gray-600">
                Value: ₹{top.value.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-2">N/A</div>
          )}
        </div>

        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Worst Performer</div>
          {worst ? (
            <div className="mt-2">
              <div className="font-bold">
                {worst.symbol} — {worst.name}
              </div>
              <div className="text-red-600 font-semibold mt-1">
                {worst.gainLossPercent}%
              </div>
              <div className="text-sm text-gray-600">
                Value: ₹{worst.value.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-2">N/A</div>
          )}
        </div>

        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Portfolio Insights</div>
          <div className="mt-2">
            <div className="text-sm">
              Holdings: <span className="font-semibold">{holdingsCount}</span>
            </div>
            <div className="text-sm">
              Diversification score:{" "}
              <span className="font-semibold">
                {summary.diversificationScore}
              </span>
            </div>
            <div className="text-sm">
              Risk level:{" "}
              <span className="font-semibold">{summary.riskLevel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;
