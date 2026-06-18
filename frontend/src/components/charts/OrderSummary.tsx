import { useGetOrderSummaryThisWeek } from "../../hooks/analytics/useGetOrderSummaryThisWeek";
import "../../css/OrderSummary.css";

export default function OrderSummary() {
  const { data: chartData, loading, error } = useGetOrderSummaryThisWeek();

  if (error) return <p style={{ color: "red" }}>Failed to load chart: {error}</p>;

  const total = loading ? 0 : chartData.values.reduce((a, b) => a + b, 0);
  const maxValue = loading ? 1 : Math.max(...chartData.values, 1);

  return (
    <div className="chart-card order-summary-card">
      <p className="chart-label">Order Summary</p>

      {loading ? (
        <p className="chart-loading">Loading...</p>
      ) : (
        <>
          <h2 className="chart-big-number">
            {total}
            <span className="chart-big-number-suffix"> orders</span>
          </h2>

          <div className="order-days">
            {chartData.labels.map((label, i) => {
              const value = chartData.values[i];
              const pct = Math.max((value / maxValue) * 100, 4);
              return (
                <div className="order-day-row" key={label}>
                  <span className="order-day-name">{label}</span>
                  <div className="order-day-track">
                    <div
                      className="order-day-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="order-day-value">{value}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}