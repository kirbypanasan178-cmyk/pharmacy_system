import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";
import type { ChartConfiguration } from "chart.js";
import { useGetRevenueThisYear } from "../../hooks/analytics/useGetRevenueThisYear";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Filler);

export const MonthlyRevenue = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line", number[], string> | null>(null);
  const { data, loading, error } = useGetRevenueThisYear();

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const best = data.reduce((a, b) => (b.revenue > a.revenue ? b : a), { month: "—", revenue: 0 });
  const avg = data.length ? Math.round(total / data.length) : 0;

  useEffect(() => {
    if (!canvasRef.current || loading || data.length === 0) return;

    chartRef.current?.destroy();

    const maxRev = Math.max(...data.map((d) => d.revenue));

    const config: ChartConfiguration<"line", number[], string> = {
      type: "line",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            data: data.map((d) => d.revenue),
            borderColor: "#1a7a4a",
            borderWidth: 2,
            pointBackgroundColor: "#1a7a4a",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true,
            backgroundColor: "rgba(26,122,74,0.07)",
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
              label: (ctx) => {
                const value = ctx.parsed?.y ?? 0;
                return "₱" + value.toLocaleString();
              },
            },
            backgroundColor: "#1a2e24",
            titleColor: "#d1ead9",
            bodyColor: "#e8f5ee",
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: "#6aab85", font: { size: 11 }, autoSkip: false },
          },
          y: {
            min: 0,
            max: maxRev > 0 ? maxRev * 1.15 : 1000,
            grid: { color: "rgba(178,216,194,0.35)" },
            border: { display: false },
            ticks: {
              color: "#6aab85",
              font: { size: 11 },
              callback: (v) => "₱" + (Number(v) / 1000).toFixed(0) + "K",
              maxTicksLimit: 5,
            },
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [data, loading]);

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "0.5px solid #b2d8c2",
    borderRadius: 12,
    padding: "1.25rem",
    width: "100%",
    boxSizing: "border-box",
  };

  const statBoxStyle: React.CSSProperties = {
    background: "#e8f5ee",
    borderRadius: 8,
    padding: "10px 14px",
    flex: 1,
  };

  if (error) return <p style={{ color: "red" }}>Failed to load chart: {error}</p>;

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6aab85", margin: "0 0 2px" }}>
            Year to date
          </p>
          <p style={{ fontSize: 15, fontWeight: 500, color: "#1a2e24", margin: "0 0 1rem" }}>
            Monthly Revenue
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <div style={statBoxStyle}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1a2e24", lineHeight: 1.2 }}>
            ₱{(total / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: 11, color: "#6aab85", marginTop: 2 }}>Total so far</div>
        </div>
        <div style={statBoxStyle}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1a2e24", lineHeight: 1.2 }}>
            ₱{(best.revenue / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: 11, color: "#6aab85", marginTop: 2 }}>Best month ({best.month})</div>
        </div>
        <div style={statBoxStyle}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1a2e24", lineHeight: 1.2 }}>
           ₱{(avg / 1000).toFixed(1)}K
          </div>
          <div style={{ fontSize: 11, color: "#6aab85", marginTop: 2 }}>Monthly avg</div>
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: 200 }}>
        {loading ? (
          <p style={{ color: "#6aab85", fontSize: 13 }}>Loading...</p>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>
    </div>
  );
};