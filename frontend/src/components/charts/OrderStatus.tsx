import { useGetOrderStatusDistribution } from "../../hooks/analytics/useGetOrderStatusDistribution";

type StatusKey = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

const STATUS_COLORS: Record<StatusKey, { dot: string; bar: string; badge: string; text: string }> = {
  pending:    { dot: "#EF9F27", bar: "#EF9F27", badge: "#fef3e0", text: "#7a4d08" },
  processing: { dot: "#378ADD", bar: "#378ADD", badge: "#e6f1fb", text: "#0c447c" },
  shipped:    { dot: "#639922", bar: "#639922", badge: "#eaf3de", text: "#27500a" },
  delivered:  { dot: "#1D9E75", bar: "#1D9E75", badge: "#e1f5ee", text: "#085041" },
  cancelled:  { dot: "#E24B4A", bar: "#E24B4A", badge: "#fcebeb", text: "#501313" },
};

export const OrderStatus = () => {
  const { data, loading, error } = useGetOrderStatusDistribution();

  const total = data.reduce((sum, item) => sum + item.count, 0);

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
        Order Status
      </p>
      <p style={{ fontSize: 12, color: "#6b7b5e", margin: "0 0 1rem", letterSpacing: "0.02em" }}>
        Distribution across all orders
      </p>

      {error && (
        <p style={{ color: "#E24B4A", fontSize: 13 }}>Failed to load data: {error}</p>
      )}

      {loading && !error && (
        <p style={{ color: "#7e9060", fontSize: 13 }}>Loading...</p>
      )}

      {!loading && !error && data.filter(({ status }) => status && STATUS_COLORS[status]).map(({ status, count }) => {
        const c = STATUS_COLORS[status];
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const label = status.charAt(0).toUpperCase() + status.slice(1);

        return (
          <div
            key={status}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: "0.5px solid rgba(99,153,34,0.1)",
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c.dot,
                flexShrink: 0,
                marginRight: 10,
              }}
            />
            <span style={{ fontSize: 13.5, color: "#173404", flex: 1, fontWeight: 400 }}>
              {label}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#27500a", marginRight: 12 }}>
              {count.toLocaleString()}
            </span>
            <div
              style={{
                width: 90,
                height: 5,
                background: "#EAF3DE",
                borderRadius: 99,
                overflow: "hidden",
                marginRight: 10,
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: c.bar,
                  borderRadius: 99,
                }}
              />
            </div>
            <span style={{ fontSize: 12, color: "#7e9060", minWidth: 32, textAlign: "right" }}>
              {pct}%
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 20,
                padding: "2px 10px",
                marginLeft: 8,
                background: c.badge,
                color: c.text,
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};