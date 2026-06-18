import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
} from "chart.js";
import type { ChartConfiguration } from "chart.js";
import { useGetTop3Categories } from "../../hooks/analytics/useGetTop3Categories";

Chart.register(DoughnutController, ArcElement, Tooltip);

const COLORS = ["#3B6D11", "#97C459", "#1D9E75"];

export const TopCategory = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"doughnut", number[], string> | null>(null);
  const { data, loading, error } = useGetTop3Categories();

  useEffect(() => {
    if (!canvasRef.current || loading || data.length === 0) return;

    chartRef.current?.destroy();

    const config: ChartConfiguration<"doughnut", number[], string> = {
      type: "doughnut",
      data: {
        labels: data.map((c) => c.category),
        datasets: [
          {
            data: data.map((c) => c.totalSold),
            backgroundColor: COLORS,
            borderWidth: 3,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} units`,
            },
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => chartRef.current?.destroy();
  }, [data, loading]);

  if (error) return <p style={{ color: "#E24B4A", fontSize: 13 }}>Failed to load chart: {error}</p>;

  const total = data.reduce((sum, c) => sum + c.totalSold, 0);

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid rgba(59,109,17,0.18)",
        borderRadius: 14,
        padding: "1.25rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <p style={{ fontSize: 15, fontWeight: 500, color: "#173404", margin: "0 0 2px" }}>
        Sales Overview
      </p>
      <p style={{ fontSize: 12, color: "#6b7b5e", margin: "0 0 1rem", letterSpacing: "0.02em" }}>
        Top 3 categories
      </p>

      {loading ? (
        <p style={{ color: "#7e9060", fontSize: 13 }}>Loading...</p>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginBottom: 14 }}>
            {data.map((c, i) => {
              const pct = total > 0 ? Math.round((c.totalSold / total) * 100) : 0;
              return (
                <span
                  key={c.category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#27500a",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  {c.category}: {pct}%
                </span>
              );
            })}
          </div>

          <div style={{ position: "relative", width: "100%", height: 180 }}>
            <canvas ref={canvasRef} />
          </div>
        </>
      )}
    </div>
  );
};