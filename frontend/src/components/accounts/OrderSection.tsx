import { useEffect } from "react"
import { OrderCard } from "../cards/OrderCard"
import { useGetOrderById } from "../../hooks/order/useGetOrder"
import { getUserId } from "../../utils/getUserId"

export const OrderSection = () => {
    const userId = getUserId()
    
    const { getOrderById } = useGetOrderById()

    useEffect(() => {
        getOrderById(userId)
    }, [])
    return (
        <div>
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">

                {/* Header */}
                <div
                    className="px-4 pt-4 pb-3 border-bottom"
                    style={{ background: "linear-gradient(135deg, #f0f7ea 0%, #dcefd0 100%)", borderColor: "#d4e8c2 !important" }}
                >
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="ti ti-shopping-bag" style={{ color: "#3b7a10", fontSize: 18 }} />
                        <h5 className="mb-0 fw-semibold" style={{ color: "#1e4a08" }}>My Orders</h5>
                    </div>
                    <p className="mb-0 small" style={{ color: "#5a9e2f" }}>
                        Track and manage your recent orders
                    </p>
                </div>

                {/* Body */}
                <div className="card-body px-4 py-3">
                    <div className="mb-3">
                        <span
                            className="badge rounded-2 px-2 py-1"
                            style={{
                                fontSize: 10,
                                letterSpacing: ".6px",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                background: "#eaf3de",
                                color: "#3b6d11",
                            }}
                        >
                            Order History
                        </span>
                    </div>

                    <OrderCard />
                </div>

            </div>
        </div>
    )
}