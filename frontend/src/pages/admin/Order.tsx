import { DashboardCard } from "../../components/cards/DashboardCard"
import { OrderTable } from "../../components/table/OrderTable"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import "../../css/Order.css"
import { useState } from "react"

export const Order = () => {
    const [search, setSearch] = useState<string>("")
    const [status, setStatus] = useState<string>("")
    const [dateFilter, setDateFilter] = useState<string>("")
    const orders = useAppSelector((state) => state.order.order)

    const pendingStatus = orders.filter((o) => o.status === "pending")
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    const formattedRevenue = `₱${totalRevenue.toLocaleString()}`
    const formattedAvg = `₱${averageOrderValue.toFixed(2)}`

    const filteredOrders = orders.filter((order) => {
        const matchesName = order.shippingAddress.fullname
        .toLowerCase().
        includes(search.toLowerCase())
        const matchesStatus = status === "" || order.status === status

        const orderDate = new Date(order.createdAt)
        const now = new Date()

        let matchesDate = true

        if (dateFilter === "today") {
            matchesDate = orderDate.toDateString() === now.toDateString()
        }

        if (dateFilter === "week") {
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(now.getDate() - 7)
         matchesDate = orderDate >= oneWeekAgo
        }

    if (dateFilter === "month") {
        const oneMonthAgo = new Date()
        oneMonthAgo.setMonth(now.getMonth() - 1)

        matchesDate = orderDate >= oneMonthAgo
    }

    if (dateFilter === "year") {
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(now.getFullYear() - 1)

        matchesDate = orderDate >= oneYearAgo
    }

    return matchesName && matchesStatus && matchesDate
    })


    return (
        <div className="order-page">
            <h1 className="order-page__heading">Orders</h1>
            <h4 className="order-page__subheading">Manage and track all customer orders</h4>

            <div className="order-page__cards mb-4">
                <DashboardCard
                    cardTitle="Total Orders"
                    cardValue={orders.length.toLocaleString()}
                    cardDescription="Total orders this month"
                    cardTrend="+12% from last month"
                />
                <DashboardCard
                    cardTitle="Pending"
                    cardValue={pendingStatus.length}
                    cardDescription="Awaiting shipment"
                    cardTrend="shipped today"
                />
                <DashboardCard
                    cardTitle="Revenue"
                    cardValue={formattedRevenue}
                    cardDescription="Total revenue this month"
                    cardTrend="+8% from last month"
                />
                <DashboardCard
                    cardTitle="Avg. Order Value"
                    cardValue={formattedAvg}
                    cardDescription="Average per order"
                    cardTrend="+3% from last month"
                />
            </div>

            {/* Search + Filters */}
            <div className="order-controls">
                <div className="search-wrapper">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                        placeholder="Search orders by customer..."
                    />
                </div>

                <div className="filters-wrapper">
                    <div className="filter-group">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                        <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <select className="filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option value="">All Dates</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <OrderTable filteredOrders={filteredOrders}/>
        </div>
    )
}