import { useEffect, useState } from "react"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import "../../css/OrderCard.css"
import { useGetOrder } from "../../hooks/order/useGetOrder"

const paymentMethodLabel: Record<string, string> = {
    cod:   "Cash on delivery",
    gcash: "GCash",
    card:  "Card",
}

const paymentMethodIcon: Record<string, string> = {
    cod:   "💵",
    gcash: "📱",
    card:  "💳",
}

export const OrderCard = () => {
    const orders = useAppSelector((state) => state.order.userOrders)
    const { getOrder } = useGetOrder()
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    useEffect(() => {
        const fetchOrder = async () => {
            await getOrder("69f5f36b8a32efadf3c2909a")
        }
        fetchOrder()
    }, [])

    return (
        <div className="order-card-list">
            {orders.length === 0 && (
                <div className="text-center py-5" style={{ color: "#9ca3af", fontSize: 13 }}>
                    You have no orders yet.
                </div>
            )}

            {orders.map((order) => {
                const isExpanded = expandedIds.has(order._id)

                const formattedDate =
                    new Date(order.createdAt).toLocaleDateString("en-PH", {
                        month: "long", day: "numeric", year: "numeric",
                    }) + " at " +
                    new Date(order.createdAt).toLocaleTimeString("en-PH", {
                        hour: "numeric", minute: "2-digit",
                    })

                return (
                    <div key={order._id} className="order-card">

                        {/* Header */}
                        <div className="order-header">
                            <div>
                                <div className="order-meta-id">
                                    <span>🧾</span>
                                    <span>{order._id}</span>
                                </div>
                                <div className="order-meta-date">{formattedDate}</div>
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
                                            "📦"
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
                                    {paymentMethodIcon[order.paymentMethod]} {paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod}
                                </span>
                                <span className={`order-payment-status ${order.paymentStatus}`}>
                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                </span>
                            </div>

                            <div className="order-footer-right">
                                <button
                                    className="order-details-toggle"
                                    onClick={() => toggleExpand(order._id)}
                                >
                                    <span className={`chevron ${isExpanded ? "open" : ""}`}>▼</span>
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
                                <div>
                                    <div className="order-detail-section-label">Shipping address</div>
                                    <div className="order-shipping-address">
                                        {order.shippingAddress.fullname}<br />
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
                                        {order.shippingAddress.phone}
                                    </div>
                                </div>

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