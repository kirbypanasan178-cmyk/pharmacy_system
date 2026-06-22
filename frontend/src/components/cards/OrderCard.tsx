import { useState } from "react"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import "../../css/OrderCard.css"

const paymentMethodLabel: Record<string, string> = {
    cod:   "Cash on delivery",
    gcash: "GCash",
    card:  "Card",
}

const paymentMethodIcon: Record<string, string> = {
    cod:   "ti-cash",
    gcash: "ti-device-mobile",
    card:  "ti-credit-card",
}

const paymentStatusIcon: Record<string, string> = {
    paid:     "ti-circle-check",
    pending:  "ti-clock",
    refunded: "ti-corner-up-left",
}

// Maps order/payment statuses to their timestamp fields
const orderTimestampFields: { label: string; field: string }[] = [
    { label: "Order placed",  field: "createdAt" },
    { label: "Paid",          field: "paidAt" },
    { label: "Shipped",       field: "shippedAt" },
    { label: "Delivered",     field: "deliveredAt" },
]

const cancellationTimestampFields: { label: string; field: string }[] = [
    { label: "Cancelled",     field: "cancelledAt" },
    { label: "Refunded",      field: "refundedAt" },
]

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PH", {
        month: "short", day: "numeric",
    }) + " · " +
    new Date(iso).toLocaleTimeString("en-PH", {
        hour: "numeric", minute: "2-digit",
    })

const formatFullDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PH", {
        month: "long", day: "numeric", year: "numeric",
    }) + " at " +
    new Date(iso).toLocaleTimeString("en-PH", {
        hour: "numeric", minute: "2-digit",
    })

export const OrderCard = () => {
    const orders = useAppSelector((state) => state.order.userOrders)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <div className="order-card-list">
            {orders.length === 0 && (
                <div className="order-empty">
                    You have no orders yet.
                </div>
            )}

            {orders.map((order) => {
                const isExpanded = expandedIds.has(order._id)
                const isCancelled = order.status === "cancelled"

                const timeline = isCancelled
                    ? [
                        { label: "Order placed", field: "createdAt" },
                        ...cancellationTimestampFields,
                    ]
                    : orderTimestampFields

                return (
                    <div key={order._id} className="order-card">

                        {/* Header */}
                        <div className="order-header">
                            <div>
                                <div className="order-meta-id">
                                    <i className="ti ti-receipt" aria-hidden="true" />
                                    <span>{order._id}</span>
                                </div>
                                <div className="order-meta-date">{formatFullDate(order.createdAt)}</div>
                            </div>
                            <span className={`order-status ${order.status}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    
                            </span>
                        </div>

                        {/* Items */}
                        <div className="order-items">
                            {order.items.map((item: any) => (
                                <div key={item._id} className="order-item-row">
                                    <div className="order-item-icon">
                                        {item.product?.image ? (
                                            <img src={item.product.image} alt="product" />
                                        ) : (
                                            <i className="ti ti-package" aria-hidden="true" />
                                        )}
                                    </div>
                                    <span className="order-item-name">{item.product?.name ?? "Product"}</span>
                                    <span className="order-item-qty">×{item.quantity}</span>
                                    <span className="order-item-price">₱{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="order-footer">
                            <div className="order-payment">
                                <span className="order-payment-method">
                                    <i className={`ti ${paymentMethodIcon[order.paymentMethod] ?? "ti-cash"}`} aria-hidden="true" />
                                    {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
                                </span>
                                <span className={`order-payment-status ${order.paymentStatus}`}>
                                    <i className={`ti ${paymentStatusIcon[order.paymentStatus] ?? "ti-clock"}`} aria-hidden="true" />
                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </span>
                            </div>

                            <div className="order-footer-right">
                                <button
                                    className="order-details-toggle"
                                    onClick={() => toggleExpand(order._id)}
                                    aria-expanded={isExpanded}
                                >
                                    <i className={`ti ti-chevron-down chevron ${isExpanded ? "open" : ""}`} aria-hidden="true" />
                                    Details
                                </button>
                                <div className="order-total-block">
                                    <div className="order-total-label">Total</div>
                                    <div className="order-total-amount">₱{order.totalPrice.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Expandable detail panel */}
                        {isExpanded && (
                            <div className="order-detail-panel">

                                {/* Column 1: Shipping + Timeline */}
                                <div>
                                    <div className="order-detail-section-label">Shipping address</div>
                                    <div className="order-shipping-address">
                                        {order.shippingAddress.fullname}<br />
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
                                        {order.shippingAddress.phone}
                                    </div>

                                    {/* Timeline */}
                                    <div className="order-timeline">
                                        <div className="order-detail-section-label">Timeline</div>
                                        {timeline.map(({ label, field }) => {
                                            const ts: string | undefined = (order as any)[field]
                                            return (
                                                <div key={field} className={`order-timeline-row ${ts ? "active" : "inactive"}`}>
                                                    <div className="order-timeline-dot" />
                                                    <span className="order-timeline-label">{label}</span>
                                                    <span className="order-timeline-date">
                                                        {ts ? formatDate(ts) : "—"}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Column 2: Price breakdown */}
                                <div>
                                    <div className="order-detail-section-label">Price breakdown</div>
                                    {order.items.map((item: any) => (
                                        <div key={item._id} className="order-breakdown-row">
                                            <span>{item.product?.name ?? "Product"} ×{item.quantity}</span>
                                            <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="order-breakdown-row">
                                        <span>Shipping fee</span>
                                        <span>{order.shippingFee === 0 ? "Free" : `₱${order.shippingFee}`}</span>
                                    </div>
                                    <div className="order-breakdown-total">
                                        <span>Total</span>
                                        <span>₱{order.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                )
            })}
        </div>
    )
}