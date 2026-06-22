import type { Order } from "../../features/orderSlice"

export interface OrderDetailsModalProps {
    selectedOrder: Order | null
    isOpen: boolean
    onClose: () => void
}

const paymentMethodLabel: Record<string, string> = {
    cod:   "Cash on delivery",
    gcash: "GCash",
    card:  "Card",
}

const paymentMethodIcon: Record<string, string> = {
    cod:   "bi-cash",
    gcash: "bi-phone",
    card:  "bi-credit-card",
}

const paymentStatusIcon: Record<string, string> = {
    paid:     "bi-check-circle",
    pending:  "bi-clock",
    refunded: "bi-arrow-return-left",
}

const paymentStatusColor: Record<string, string> = {
    paid:     "#3B6D11",
    pending:  "#856404",
    refunded: "#0c4a6e",
}

const orderTimestampFields: { label: string; field: string }[] = [
    { label: "Order placed", field: "createdAt" },
    { label: "Paid",         field: "paidAt" },
    { label: "Shipped",      field: "shippedAt" },
    { label: "Delivered",    field: "deliveredAt" },
]

const cancellationTimestampFields: { label: string; field: string }[] = [
    { label: "Order placed", field: "createdAt" },
    { label: "Cancelled",    field: "cancelledAt" },
    { label: "Refunded",     field: "refundedAt" },
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

const statusBadgeStyle: Record<string, React.CSSProperties> = {
    pending:    { background: "#fff3cd", color: "#856404", border: "1px solid #ffc107" },
    processing: { background: "#EAF3DE", color: "#3B6D11", border: "1px solid #C0DD97" },
    shipped:    { background: "#cff4fc", color: "#055160", border: "1px solid #9eeaf9" },
    delivered:  { background: "#d1e7dd", color: "#0a3622", border: "1px solid #a3cfbb" },
    cancelled:  { background: "#f8d7da", color: "#842029", border: "1px solid #f1aeb5" },
}

export const OrderDetailsModal = ({
    selectedOrder,
    isOpen,
    onClose,
}: OrderDetailsModalProps) => {
    if (!isOpen || !selectedOrder) return null

    const isCancelled = selectedOrder.status === "cancelled"

    const timeline = isCancelled
        ? cancellationTimestampFields
        : orderTimestampFields

    const badgeStyle = statusBadgeStyle[selectedOrder.status] ?? {
        background: "#e2e3e5", color: "#41464b", border: "1px solid #d3d6d8",
    }

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-4 shadow-lg d-flex flex-column"
                style={{
                    width: 600,
                    maxHeight: "90vh",
                    border: "1px solid #C0DD97",
                    overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scrollable body */}
                <div style={{ overflowY: "auto", flex: 1 }}>

                    {/* ── Header ── */}
                    <div
                        className="d-flex align-items-start justify-content-between px-4 py-3"
                        style={{ background: "#3B6D11", flexShrink: 0 }}
                    >
                        <div>
                            <p className="mb-0 text-uppercase fw-semibold"
                                style={{ fontSize: 10, color: "#97C459", letterSpacing: "0.08em" }}>
                                Order ID
                            </p>
                            <p className="mb-1 font-monospace fw-medium"
                                style={{ fontSize: 13, color: "#EAF3DE", wordBreak: "break-all" }}>
                                #{selectedOrder._id}
                            </p>
                            <p className="mb-0" style={{ fontSize: 12, color: "#97C459" }}>
                                {formatFullDate(selectedOrder.createdAt)}
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-2 ms-3">
                            <span className="rounded-pill px-3 py-1 fw-medium"
                                style={{ fontSize: 12, ...badgeStyle }}>
                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                            </span>
                            <button
                                className="btn btn-sm p-1 border-0 d-flex align-items-center justify-content-center"
                                style={{ color: "#97C459", background: "transparent", lineHeight: 1 }}
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <i className="bi bi-x-lg fs-5" />
                            </button>
                        </div>
                    </div>

                    {/* ── Items ── */}
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid #C0DD97" }}>
                        <p className="mb-2 text-uppercase fw-semibold"
                            style={{ fontSize: 11, color: "#3B6D11", letterSpacing: "0.06em" }}>
                            Items ordered
                        </p>
                        <div className="d-flex flex-column gap-2">
                            {selectedOrder.items.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="d-flex align-items-center gap-3 rounded-3 px-3 py-2"
                                    style={{ background: "#EAF3DE", border: "1px solid #C0DD97" }}
                                >
                                    {/* Image or fallback icon */}
                                    <div
                                        className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
                                        style={{ width: 40, height: 40, background: "#C0DD97" }}
                                    >
                                        {item.product?.image ? (
                                            <img
                                                src={item.product.image}
                                                alt={item.product?.name}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <i className="bi bi-box-seam" style={{ color: "#27500A", fontSize: 18 }} />
                                        )}
                                    </div>
                                    <span className="flex-grow-1 fw-medium text-truncate"
                                        style={{ fontSize: 13, color: "#27500A" }}>
                                        {item.product?.name ?? "Product"}
                                    </span>
                                    <span style={{ fontSize: 13, color: "#639922" }}>
                                        ×{item.quantity}
                                    </span>
                                    <span className="fw-medium" style={{ fontSize: 13, color: "#3B6D11", whiteSpace: "nowrap" }}>
                                        ₱{(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Two-column detail panel ── */}
                    <div className="px-4 py-3 d-grid gap-4"
                        style={{ gridTemplateColumns: "1fr 1fr", display: "grid", borderBottom: "1px solid #C0DD97" }}>

                        {/* Column 1: Shipping + Timeline */}
                        <div className="d-flex flex-column gap-3">

                            {/* Shipping address */}
                            <div>
                                <p className="mb-2 text-uppercase fw-semibold"
                                    style={{ fontSize: 11, color: "#3B6D11", letterSpacing: "0.06em" }}>
                                    Shipping address
                                </p>
                                <div className="d-flex gap-2 align-items-start">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                                        style={{ width: 32, height: 32, background: "#EAF3DE", border: "1px solid #C0DD97", color: "#3B6D11" }}
                                    >
                                        <i className="bi bi-geo-alt" style={{ fontSize: 15 }} />
                                    </div>
                                    <p className="mb-0" style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>
                                        <span className="fw-medium" style={{ color: "#27500A" }}>
                                            {selectedOrder.shippingAddress.fullname}
                                        </span><br />
                                        {selectedOrder.shippingAddress.street}<br />
                                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}<br />
                                        <i className="bi bi-telephone" style={{ fontSize: 12 }} /> {selectedOrder.shippingAddress.phone}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <p className="mb-2 text-uppercase fw-semibold"
                                    style={{ fontSize: 11, color: "#3B6D11", letterSpacing: "0.06em" }}>
                                    Timeline
                                </p>
                                <div className="d-flex flex-column gap-1">
                                    {timeline.map(({ label, field }) => {
                                        const ts: string | undefined = (selectedOrder as any)[field]
                                        return (
                                            <div
                                                key={field}
                                                className="d-flex align-items-center gap-2"
                                                style={{ opacity: ts ? 1 : 0.4 }}
                                            >
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                                                    background: ts ? "#3B6D11" : "#C0DD97",
                                                    border: "2px solid #3B6D11",
                                                }} />
                                                <span style={{ fontSize: 12, color: "#3B6D11", minWidth: 90 }}>{label}</span>
                                                <span style={{ fontSize: 12, color: "#639922" }}>
                                                    {ts ? formatDate(ts) : "—"}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Price breakdown + Payment */}
                        <div className="d-flex flex-column gap-3">

                            {/* Price breakdown */}
                            <div>
                                <p className="mb-2 text-uppercase fw-semibold"
                                    style={{ fontSize: 11, color: "#3B6D11", letterSpacing: "0.06em" }}>
                                    Price breakdown
                                </p>
                                <div className="d-flex flex-column gap-1">
                                    {selectedOrder.items.map((item: any) => (
                                        <div key={item._id} className="d-flex justify-content-between">
                                            <span style={{ fontSize: 13, color: "#555" }}>
                                                {item.product?.name ?? "Product"} ×{item.quantity}
                                            </span>
                                            <span style={{ fontSize: 13, color: "#27500A" }}>
                                                ₱{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between">
                                        <span style={{ fontSize: 13, color: "#555" }}>Shipping fee</span>
                                        <span style={{ fontSize: 13, color: "#27500A" }}>
                                            {selectedOrder.shippingFee === 0 ? "Free" : `₱${selectedOrder.shippingFee.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div
                                        className="d-flex justify-content-between fw-medium pt-2 mt-1"
                                        style={{ borderTop: "1px dashed #C0DD97", color: "#27500A" }}
                                    >
                                        <span>Total</span>
                                        <span>₱{selectedOrder.totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment info */}
                            <div>
                                <p className="mb-2 text-uppercase fw-semibold"
                                    style={{ fontSize: 11, color: "#3B6D11", letterSpacing: "0.06em" }}>
                                    Payment
                                </p>
                                <div className="d-flex flex-column gap-2">
                                    <div
                                        className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                                        style={{ background: "#EAF3DE", border: "1px solid #C0DD97" }}
                                    >
                                        <i
                                            className={`bi ${paymentMethodIcon[selectedOrder.paymentMethod] ?? "bi-cash"}`}
                                            style={{ color: "#3B6D11", fontSize: 16 }}
                                        />
                                        <span style={{ fontSize: 13, color: "#3B6D11" }}>
                                            {paymentMethodLabel[selectedOrder.paymentMethod] ?? selectedOrder.paymentMethod}
                                        </span>
                                    </div>
                                    <div
                                        className="d-flex align-items-center gap-2 rounded-3 px-3 py-2"
                                        style={{ background: "#EAF3DE", border: "1px solid #C0DD97" }}
                                    >
                                        <i
                                            className={`bi ${paymentStatusIcon[selectedOrder.paymentStatus] ?? "bi-clock"}`}
                                            style={{
                                                fontSize: 16,
                                                color: paymentStatusColor[selectedOrder.paymentStatus] ?? "#555",
                                            }}
                                        />
                                        <span style={{
                                            fontSize: 13,
                                            color: paymentStatusColor[selectedOrder.paymentStatus] ?? "#555",
                                        }}>
                                            {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ── Footer actions (always visible) ── */}
                <div
                    className="d-flex justify-content-end gap-2 px-4 py-3"
                    style={{ borderTop: "1px solid #C0DD97", flexShrink: 0 }}
                >
                    <button
                        className="btn btn-sm d-flex align-items-center gap-1"
                        style={{ border: "1px solid #97C459", color: "#3B6D11", background: "transparent", borderRadius: 8 }}
                        onClick={onClose}
                    >
                        <i className="bi bi-x-circle" /> Close
                    </button>
                    <button
                        className="btn btn-sm d-flex align-items-center gap-1 fw-medium"
                        style={{ background: "#3B6D11", color: "#EAF3DE", border: "none", borderRadius: 8 }}
                        onClick={() => window.print()}
                    >
                        <i className="bi bi-printer" /> Print receipt
                    </button>
                </div>

            </div>
        </div>
    )
}