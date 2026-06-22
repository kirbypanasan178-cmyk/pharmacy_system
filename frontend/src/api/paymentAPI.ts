import { getToken } from "../utils/getToken"

const API_URL = "http://localhost:2000/api/payment"

export const createGCashPaymentSourceAPI = async (orderId: string, amount: number) => {
    const token = getToken()
    const response = await fetch(`${API_URL}/gcash/create-source`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, amount })
    })

    const data = await response.json()

    if (!response.ok) throw new Error("Payment initiation failed")
    
    return data
}