import { OrderTable } from "../../components/table/OrderTable";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/Order.css";
import { useEffect, useState } from "react";
import { useGetAllOrder } from "../../hooks/order/useGetAllOrder";
import { useGetOrderStatusDistribution } from "../../hooks/analytics/useGetOrderStatusDistribution";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend?: string;
  icon: string;
  accentColor: string;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  description,
  trend,
  icon,
  accentColor,
  iconBg,
  iconColor,
}: StatCardProps) => (
  <div className="order-stat-card" style={{ borderLeftColor: accentColor }}>
    <div className="order-stat-card__top">
      <div className="order-stat-card__text">
        <p className="order-stat-card__title">{title}</p>
        <p className="order-stat-card__value">{value}</p>
      </div>
      <div
        className="order-stat-card__icon-wrap"
        style={{ background: iconBg }}
      >
        <i
          className={`bi ${icon}`}
          style={{ fontSize: 18, color: iconColor }}
        />
      </div>
    </div>
    <div className="order-stat-card__footer">
      <i className="bi bi-info-circle order-stat-card__footer-icon" />
      <span className="order-stat-card__description">{description}</span>
      {trend && <span className="order-stat-card__trend">{trend}</span>}
    </div>
  </div>
);

export const Order = () => {
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const orders = useAppSelector((state) => state.order.adminOrders);

  const { getAllOrder } = useGetAllOrder();
  const { data } = useGetOrderStatusDistribution();

  const pendingCount = data.find((d) => d.status === "pending")?.count || 0;
  const shippedCount = data.find((d) => d.status === "shipped")?.count || 0;
  const deliveredCount = data.find((d) => d.status === "delivered")?.count || 0;
  const cancelledCount = data.find((d) => d.status === "cancelled")?.count || 0;

  const filteredOrders = orders
    .filter((order) => {
      const matchesName = order.shippingAddress.fullname
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = status === "" || order.status === status;

      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let matchesDate = true;

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesDate = orderDate >= oneWeekAgo;
      } else if (dateFilter === "month") {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesDate = orderDate >= oneMonthAgo;
      } else if (dateFilter === "year") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesDate = orderDate >= oneYearAgo;
      }

      return matchesName && matchesStatus && matchesDate;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  useEffect(() => {
    getAllOrder();
  });

  return (
    <div className="order-page">
      {/* Page Header */}
      <div className="order-page__header">
        <div>
          <h1 className="order-page__heading">Orders</h1>
          <p className="order-page__subheading">
            Manage and track all customer orders
          </p>
        </div>
        <div className="order-page__header-badge">
          <i className="bi bi-box-seam" />
          <span>{orders.length} total</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="order-page__cards">
        <StatCard
          title="Pending"
          value={pendingCount}
          description="Orders waiting to be processed"
          icon="bi-hourglass-split"
          accentColor="#d97706"
          iconBg="rgba(217,119,6,0.10)"
          iconColor="#d97706"
        />


        <StatCard
          title="Shipped"
          value={shippedCount}
          description="Orders on the way to customers"
          icon="bi-currency-exchange"
          accentColor="#16a34a"
          iconBg="rgba(22,163,74,0.10)"
          iconColor="#16a34a"
        />

        <StatCard
          title="Delivered"
          value={deliveredCount}
          description="Orders successfully received by customers"
          icon="bi-truck"
          accentColor="#7c3aed"
          iconBg="rgba(124,58,237,0.10)"
          iconColor="#7c3aed"
        />

        <StatCard
          title="Cancelled"
          value={cancelledCount}
          description="Orders that were cancelled"
          icon="bi-receipt"
          accentColor="#3b6d11"
          iconBg="rgba(59,109,17,0.10)"
          iconColor="#3b6d11"
        />
      </div>

      {/* Controls */}
      <div className="order-controls">
        <div className="order-controls__search">
          <i className="bi bi-search order-controls__search-icon" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="order-controls__search-input"
            placeholder="Search by customer name..."
          />
        </div>

        <div className="order-controls__filters">
          <div className="order-controls__filter-group">
            <i className="bi bi-funnel order-controls__filter-icon" />
            <select
              className="order-controls__select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="order-controls__filter-group">
            <i className="bi bi-calendar3 order-controls__filter-icon" />
            <select
              className="order-controls__select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {(search || status || dateFilter) && (
            <button
              className="order-controls__clear-btn"
              onClick={() => {
                setSearch("");
                setStatus("");
                setDateFilter("");
              }}
            >
              <i className="bi bi-x-circle" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results label */}
      <div className="order-results-label">
        Showing <strong>{filteredOrders.length}</strong> of{" "}
        <strong>{orders.length}</strong> orders
      </div>

      <OrderTable filteredOrders={filteredOrders} />
    </div>
  );
};
