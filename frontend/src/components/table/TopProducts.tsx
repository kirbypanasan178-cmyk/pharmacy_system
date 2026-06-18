import { useGetTop10Products } from "../../hooks/analytics/useGetTop10Products";

export const TopProducts = () => {
  const { data, loading, error } = useGetTop10Products();

  if (error) return <p style={{ color: "red" }}>Failed to load: {error}</p>;

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid rgba(0,0,0,0.10)",
      borderRadius: 12,
      padding: "1.25rem 0",
      width: "100%",
    }}>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#111", margin: "0 0 1.25rem", padding: "0 1.5rem" }}>
        Top Products
      </p>

      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        padding: "0.5rem 1.5rem",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
      }}>
        {["Product Name", "Price", "Total Sold", "Revenue"].map((h) => (
          <span key={h} style={{ fontSize: 12, color: "#999", fontWeight: 400 }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "1rem 1.5rem", borderBottom: "0.5px solid rgba(0,0,0,0.06)",
            }}>
              {[60, 20, 25, 20].map((w, j) => (
                <div key={j} style={{ height: 14, borderRadius: 4, background: "#f1efe8", width: `${w}%` }} />
              ))}
            </div>
          ))
        : data.map((item, i) => (
            <div key={item.name} style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "1rem 1.5rem",
              borderBottom: i < data.length - 1 ? "0.5px solid rgba(0,0,0,0.07)" : "none",
              alignItems: "center",
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{item.name}</span>
              <span style={{ fontSize: 14, color: "#666" }}>₱{item.price.toFixed(2)}</span>
              <span style={{ fontSize: 14, color: "#666" }}>{item.totalSold.toLocaleString()}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                ₱{item.revenue.toLocaleString()}
              </span>
            </div>
          ))}
    </div>
  );
};