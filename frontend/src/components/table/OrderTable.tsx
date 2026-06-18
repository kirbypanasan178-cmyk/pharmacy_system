import { useState } from "react";
import "../../css/OrderTable.css";
import { useUpdateAdminOrder } from "../../hooks/order/useUpdateAdminOrder";
import type { PaymentStatus, Status } from "../../types/order";
import { getInitials } from "../../utils/getInitials";

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

const getTotalItems = (items: any): number => {
  if (!items) return 0;
  if (Array.isArray(items)) {
    return items.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0);
  }
  return items.quantity ?? 0;
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

  return (
    <div className="ot-wrap">
      {/* Toolbar */}
      <div className="ot-toolbar">
        <p className="ot-title">
          <i className="bi bi-table me-2" style={{ color: "#3b6d11" }} />
          Order List
        </p>
        <span className="ot-count">
          {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="ot-table-wrap">
        {filteredOrders.length === 0 ? (
          <div className="ot-empty">
            <i className="bi bi-inbox" />
            <p>No orders match your filters.</p>
          </div>
        ) : (
          <table className="ot-table">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "17%" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date Ordered</th>
                <th>Date Updated</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order: any) => {
                const isEditing  = editingOrderId === order._id;
               
                const totalItems = getTotalItems(order.items);

                return (
                  <tr key={order._id} className={isEditing ? "ot-row--editing" : ""}>

                    {/* Customer */}
                    <td>
                      <div className="ot-customer">
                        <div className="ot-avatar">{getInitials(order.shippingAddress.fullname)}</div>
                        <span className="ot-customer-name">
                          {order.shippingAddress.fullname}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="ot-amount">
                      ₱{order.totalPrice.toLocaleString()}
                    </td>

                    {/* Items */}
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

                    {/* Payment */}
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

                    {/* Date Ordered*/}
                    <td className="ot-dim">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day:   "numeric",
                        year:  "numeric",
                      })}
                    </td>

                     {/* Date Updated*/}
                    <td className="ot-dim">
                      {new Date(order.updatedAt).toLocaleDateString("en-US", {
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
                            <i className="bi bi-check-lg me-1" />
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
                                <i className="bi bi-eye" />
                                View details
                              </button>
                              <button
                                className="ot-dd-item"
                                onClick={() => openEdit(order)}
                              >
                                <i className="bi bi-pencil" />
                                Edit order
                              </button>
                              <div className="ot-dd-sep" />
                              <button className="ot-dd-item ot-dd-item--danger">
                                <i className="bi bi-x-circle" />
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
        )}
      </div>
    </div>
  );
};