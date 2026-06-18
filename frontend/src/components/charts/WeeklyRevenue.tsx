import { useEffect, useRef } from "react";
import { useGetWeeklyRevenue } from "../../hooks/analytics/useGetWeeklyRevenue";

export const WeeklyRevenue = () => {
  const { data, loading, error } = useGetWeeklyRevenue();
  const barsRef = useRef<HTMLDivElement | null>(null);

  const days: string[] = data?.day ?? [];
  const revenues: number[] = data?.revenue ?? [];
  const maxRev = revenues.length ? Math.max(...revenues) : 1;
  const total = revenues.reduce((s, v) => s + v, 0);
  const bestIdx = revenues.length ? revenues.indexOf(Math.max(...revenues)) : -1;
  const avg = revenues.length ? Math.round(total / revenues.length) : 0;

  useEffect(() => {
    if (!barsRef.current || loading || revenues.length === 0) return;
    const fills = barsRef.current.querySelectorAll<HTMLDivElement>(".bar-fill");
    requestAnimationFrame(() => {
      fills.forEach((el) => {
        el.style.width = el.dataset.pct + "%";
      });
    });
  }, [revenues, loading]);

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
      <div style={{ marginBottom: "0.25rem" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6aab85", margin: "0 0 2px" }}>
          This week
        </p>
        <p style={{ fontSize: 15, fontWeight: 500, color: "#1a2e24", margin: "0 0 1rem" }}>
          Weekly Revenue
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: "1rem" }}>
        <div style={statBoxStyle}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1a2e24", lineHeight: 1.2 }}>
            ₱{total.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#6aab85", marginTop: 2 }}>Week total</div>
        </div>
        <div style={statBoxStyle}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1a2e24", lineHeight: 1.2 }}>
            ₱{bestIdx >= 0 ? revenues[bestIdx].toLocaleString() : 0}
          </div>
          <div style={{ fontSize: 11, color: "#6aab85", marginTop: 2 }}>
            Best day ({bestIdx >= 0 ? days[bestIdx] : "—"})
          </div>
        </div>
        <div style={statBoxStyle}>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#1a2e24", lineHeight: 1.2 }}>
            ₱{avg.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#6aab85", marginTop: 2 }}>Daily avg</div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#6aab85", fontSize: 13 }}>Loading...</p>
      ) : (
        <div ref={barsRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {days.map((day, i) => {
            const pct = Math.round((revenues[i] / maxRev) * 100);
            return (
              <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                <span style={{ width: 28, color: "#6b7280", fontWeight: 500, flexShrink: 0, textAlign: "right" }}>
                  {day}
                </span>
                <div style={{ flex: 1, height: 18, background: "#e8f5ee", borderRadius: 4, overflow: "hidden" }}>
                  <div
                    className="bar-fill"
                    data-pct={pct}
                    style={{
                      height: "100%",
                      background: "#1a7a4a",
                      borderRadius: 4,
                      width: "0%",
                      transition: "width 0.9s cubic-bezier(0.22, 0.61, 0.36, 1)",
                    }}
                  />
                </div>
                <span style={{ width: 60, textAlign: "right", color: "#1a2e24", fontWeight: 500, flexShrink: 0 }}>
                  ₱{revenues[i].toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};