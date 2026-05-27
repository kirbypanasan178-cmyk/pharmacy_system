import { useState } from "react";
import "../../css/OrderTable.css";
import { useUpdateAdminOrder } from "../../hooks/order/useUpdateAdminOrder";
import type { PaymentStatus, Status } from "../../types/order";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "pending",   label: "Pending" },
  { value: "shipped",   label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: "paid",     label: "Paid" },
  { value: "unpaid",   label: "Unpaid" },
  { value: "refunded", label: "Refunded" },
];

const statusBadgeClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":   return "ot-badge ot-badge--pending";
    case "shipped":   return "ot-badge ot-badge--shipped";
    case "delivered": return "ot-badge ot-badge--delivered";
    case "cancelled": return "ot-badge ot-badge--cancelled";
    default:          return "ot-badge";
  }
};

const paymentBadgeClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":     return "ot-badge ot-badge--paid";
    case "unpaid":   return "ot-badge ot-badge--unpaid";
    case "refunded": return "ot-badge ot-badge--refunded";
    default:         return "ot-badge";
  }
};

export const OrderTable = ({ filteredOrders }: any) => {
  const [openMenuId, setOpenMenuId]               = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId]       = useState<string | null>(null);
  const [editStatus, setEditStatus]               = useState<string>("");
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>("");

  const { updateAdminOrder } = useUpdateAdminOrder();

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const openEdit = (order: any) => {
    setEditingOrderId(order._id);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setOpenMenuId(null);
  };

  const handleSave = async (orderId: string) => {
    await updateAdminOrder(
      orderId,
      editStatus as Status,
      editPaymentStatus as PaymentStatus
    );
    setEditingOrderId(null);
  };

  // ── helpers ──────────────────────────────────────────────────────────────
  /** Safely sum quantity across all items in an order */
  const getTotalItems = (items: any): number => {
    if (!items) return 0;
    if (Array.isArray(items)) {
      return items.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0);
    }
    // fallback: single object with a quantity field
    return items.quantity ?? 0;
  };

  return (
    <div className="ot-wrap">
      {/* Toolbar */}
      <div className="ot-toolbar">
        <p className="ot-title">Orders</p>
        <span className="ot-count">{filteredOrders.length} orders</span>
      </div>

      <div className="ot-table-wrap">
        <table className="ot-table">
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Items</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order: any) => {
              const isEditing  = editingOrderId === order._id;
              const initial    = order.shippingAddress.fullname?.charAt(0).toUpperCase() ?? "?";
              const totalItems = getTotalItems(order.items);

              return (
                <tr key={order._id} className={isEditing ? "ot-row--editing" : ""}>

                  {/* Customer */}
                  <td>
                    <div className="ot-customer">
                      <div className="ot-avatar">{initial}</div>
                      <span className="ot-customer-name">
                        {order.shippingAddress.fullname}
                      </span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="ot-amount">
                    ₱{order.totalPrice.toLocaleString()}
                  </td>

                  {/* Items — fixed: was reading order.items.quantity on an array */}
                  <td>
                    <span className="ot-dim">
                      {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    {isEditing ? (
                      <select
                        className="ot-select"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={statusBadgeClass(order.status)}>
                        <span className="ot-badge-dot" />
                        {order.status}
                      </span>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td>
                    {isEditing ? (
                      <select
                        className="ot-select"
                        value={editPaymentStatus}
                        onChange={(e) => setEditPaymentStatus(e.target.value)}
                      >
                        {PAYMENT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={paymentBadgeClass(order.paymentStatus)}>
                        <span className="ot-badge-dot" />
                        {order.paymentStatus}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="ot-dim">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day:   "numeric",
                      year:  "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td>
                    {isEditing ? (
                      <div className="ot-edit-actions">
                        <button
                          className="ot-btn ot-btn--save"
                          onClick={() => handleSave(order._id)}
                        >
                          Save
                        </button>
                        <button
                          className="ot-btn"
                          onClick={() => setEditingOrderId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="ot-menu-wrap">
                        <button
                          className="ot-dots-btn"
                          onClick={() => toggleMenu(order._id)}
                          aria-label="Order actions"
                        >
                          <span />
                          <span />
                          <span />
                        </button>

                        {openMenuId === order._id && (
                          <div className="ot-dropdown">
                            <button className="ot-dd-item">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View details
                            </button>
                            <button
                              className="ot-dd-item"
                              onClick={() => openEdit(order)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit order
                            </button>
                            <div className="ot-dd-sep" />
                            <button className="ot-dd-item ot-dd-item--danger">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Cancel order
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};