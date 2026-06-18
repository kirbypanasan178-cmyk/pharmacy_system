import { getToken } from "../utils/getToken"

const API_URL = "http://localhost:2000/api/analytics"

export const getTop3CategoriesAPI = async () => {
    const token = getToken()
    const response = await fetch(`${API_URL}/top-categories`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch top 3 categories")
    }

    return await response.json()
}

export const getOrderSummaryThisWeekAPI = async () => {
    const token = getToken()
    const response = await fetch(`${API_URL}/orders-this-week`, {
        method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch order summary this week")
    }

    return await response.json()
}

export const getTop10ProductsAPI = async () => {
     const token = getToken()
    const response = await fetch(`${API_URL}/top-products`, {
        method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch top 10 products")
    }

    return await response.json()
}

export const getWeeklyRevenueAPI = async () => {
     const token = getToken()
    const response = await fetch(`${API_URL}/weekly-revenue`, {
        method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch revenue this year")
    }

    return await response.json()
}
export const getRevenueThisYearAPI = async () => {
     const token = getToken()
    const response = await fetch(`${API_URL}/revenue-this-year`, {
        method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch revenue this year")
    }

    return await response.json()
}

export const getOrderStatusDistributionAPI = async () => {
    const token = getToken()
    const response = await fetch(`${API_URL}/order-status-distribution`, {
        method: "GET",
         headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch revenue this year")
    }

    return await response.json()
}
