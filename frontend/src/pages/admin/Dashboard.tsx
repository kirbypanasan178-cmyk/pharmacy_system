import { useAppSelector } from "../../hooks/redux/reduxHooks";
import { useEffect, useState } from "react";
import { useGetOrdersTodayCount } from "../../hooks/order/useGetOrdersTodayCount";
import { useGetSalesToday } from "../../hooks/order/useGetSalesToday";
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";
import { useGetAllOrder } from "../../hooks/order/useGetAllOrder";
import OrderSummary from "../../components/charts/OrderSummary";
import { TopProducts } from "../../components/table/TopProducts";
import { TopCategory } from "../../components/charts/TopCategory";
import { MonthlyRevenue } from "../../components/charts/Revenue";
import { OrderStatus } from "../../components/charts/OrderStatus";
import { WeeklyRevenue } from "../../components/charts/WeeklyRevenue";

const token = {
  green900: "#173404",
  green800: "#27500A",
  green600: "#3B6D11",
  green400: "#639922",
  green200: "#97C459",
  green100: "#C0DD97",
  green50:  "#EAF3DE",
  cardBorder: "0.5px solid rgba(59,109,17,0.15)",
  cardRadius: 14,
  pageBg: "#f4f7f5",
};

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  icon: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({ title, value, description, trend, icon, accentColor, iconBg, iconColor }: StatCardProps) => (
  <div
    style={{
      background: "#fff",
      border: token.cardBorder,
      borderRadius: token.cardRadius,
      borderLeft: `3px solid ${accentColor}`,
      padding: "1.1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      boxSizing: "border-box",
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
      <div>
        <p style={{ fontSize: 11.5, fontWeight: 500, color: "#6b7b5e", margin: "0 0 4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {title}
        </p>
        <p style={{ fontSize: 26, fontWeight: 600, color: token.green900, margin: 0, lineHeight: 1.15 }}>
          {value}
        </p>
      </div>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <i className={`bi ${icon}`} style={{ fontSize: 18, color: iconColor }} />
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 10, borderTop: "0.5px solid rgba(59,109,17,0.1)" }}>
      <i className="bi bi-info-circle" style={{ fontSize: 11, color: "#7e9060" }} />
      <span style={{ fontSize: 11.5, color: "#7e9060" }}>{description}</span>
      <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 500, background: token.green50, color: token.green600, borderRadius: 20, padding: "2px 9px" }}>
        {trend}
      </span>
    </div>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11.5, fontWeight: 500, color: token.green600, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 10px" }}>
    {children}
  </p>
);

export const Dashboard = () => {
  const [ordersTodayCount, setOrdersTodayCount] = useState<number>(0);
  const [salesToday, setSalesToday] = useState<number>(0);

  const orders   = useAppSelector((state) => state.order?.adminOrders ?? []);
  const products = useAppSelector((state) => state.product?.products ?? []);

  const lowStockProductCount = products.filter((prod) => prod.stock <= 5)

  const { getAllProduct }        = useGetAllProduct();
  const { getOrdersTodayCount } = useGetOrdersTodayCount();
  const { getSalesToday }       = useGetSalesToday();
  const { getAllOrder }          = useGetAllOrder();

  useEffect(() => {
    const fetchData = async () => {
      await getAllProduct();
      await getAllOrder();
      const orderCount = await getOrdersTodayCount();
      const sales = await getSalesToday();
      console.log("Order today: ", orderCount)
      console.log("sales: ", sales)
      setOrdersTodayCount(orderCount);
      setSalesToday(sales);
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: token.pageBg, padding: "2rem 2rem 3rem", boxSizing: "border-box", fontFamily: "inherit" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: "1.75rem" }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: token.green400, margin: "0 0 2px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Pharmacy System
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: token.green900, margin: 0 }}>Dashboard</h1>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: token.green600, background: "#fff", border: token.cardBorder, borderRadius: 20, padding: "5px 14px" }}>
          <i className="bi bi-calendar3" style={{ fontSize: 12 }} />
          {today}
        </span>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: "1.75rem" }}>
        <StatCard
          title="Sales Today"
          value={`₱${(salesToday ?? 0).toLocaleString()}`}
          description="Revenue collected today"
          trend="Today"
          icon="bi-bag-check-fill"
          accentColor={token.green400}
          iconBg={token.green50}
          iconColor={token.green600}
        />
        <StatCard
          title="Orders Today"
          value={ordersTodayCount ?? 0}
          description="Orders placed today"
          trend="Today"
          icon="bi-receipt"
          accentColor="#378ADD"
          iconBg="#e6f1fb"
          iconColor="#185FA5"
        />
        <StatCard
          title="Low Stock Products"
          value={lowStockProductCount.length}
          description="Items in inventory"
          trend="Current stock"
          icon="bi-box-seam"
          accentColor="#EF9F27"
          iconBg="#fef3e0"
          iconColor="#7a4d08"
        />
        <StatCard
          title="Total Revenue"
          value={`₱${totalRevenue.toLocaleString()}`}
          description="All completed sales"
          trend="Gross income"
          icon="bi-currency-exchange"
          accentColor="#1D9E75"
          iconBg="#e1f5ee"
          iconColor="#085041"
        />
      </div>

      {/* Row 1: Order Summary (left) + Monthly Revenue (right) */}
      <SectionLabel>Analytics</SectionLabel>
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
    marginBottom: "1.75rem",
  }}
>
  <MonthlyRevenue />
</div>

      {/* Row 2: Top Category (narrow left) + Order Status (wide right) */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12, marginBottom: "1.75rem", }}>
  <TopCategory />
  <OrderStatus />
</div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12, marginBottom: "1.75rem", }}>
  <WeeklyRevenue />
  <OrderSummary />
</div>

      {/* Top Products */}
      <SectionLabel>Top Products</SectionLabel>
      <div style={{ background: "#fff", border: token.cardBorder, borderRadius: token.cardRadius, overflow: "hidden" }}>
        <TopProducts />
      </div>

    </div>
  );
};