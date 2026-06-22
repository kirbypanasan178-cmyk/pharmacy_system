import { useEffect, useRef } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useGetOrderSummaryThisWeek } from "../../hooks/analytics/useGetOrderSummaryThisWeek";
import "../../css/OrderSummary.css";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export default function OrderSummary() {
  const { data: chartData, loading, error } = useGetOrderSummaryThisWeek();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (loading || !chartData || !canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const maxValue = Math.max(...chartData.values, 1);
    const peakIndex = chartData.values.indexOf(Math.max(...chartData.values));

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.values,
            backgroundColor: chartData.values.map((v, i) =>
              i === peakIndex && v > 0 ? "#085a49" : isDark ? "#085a49" : "#dde2d6"
            ),
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.raw} order${ctx.raw !== 1 ? "s" : ""}`,
            },
            backgroundColor: isDark ? "#2c2c2a" : "#1c1c1a",
            titleColor: "#ffffff",
            bodyColor: "#cccccc",
            cornerRadius: 8,
            padding: 10,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: isDark ? "#888780" : "#a0a096",
              font: { size: 11, weight: 500 },
            },
          },
          y: {
            beginAtZero: true,
            max: Math.max(maxValue + 1, 3),
            grid: {
              color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
            },
            border: { display: false },
            ticks: {
              stepSize: 1,
              color: isDark ? "#888780" : "#a0a096",
              font: { size: 11 },
              callback: (v) => Math.round(v as number),
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [loading, chartData]);

  if (error) return <p style={{ color: "red" }}>Failed to load chart: {error}</p>;

  const total = loading ? 0 : chartData.values.reduce((a, b) => a + b, 0);
  const peakIndex = loading ? -1 : chartData.values.indexOf(Math.max(...chartData.values));
  const peakDay = !loading && peakIndex >= 0 ? chartData.labels[peakIndex] : null;
  const peakCount = !loading && peakIndex >= 0 ? chartData.values[peakIndex] : 0;

  return (
    <div className="chart-card order-summary-card">
      <div className="order-summary-top">
        <div>
          <p className="os-eyebrow">Order Summary</p>
          <div className="os-total">{total}</div>
          <div className="os-total-label">orders this week</div>
        </div>
        {peakDay && peakCount > 0 && (
          <div className="os-peak-chip">
            <div className="os-peak-dot" />
            Peak: <span className="os-peak-day">{peakDay} · {peakCount}</span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="chart-loading">Loading...</p>
      ) : (
        <div className="os-chart-wrap">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`Bar chart of orders per day. Total: ${total}`}
          />
        </div>
      )}
    </div>
  );
}