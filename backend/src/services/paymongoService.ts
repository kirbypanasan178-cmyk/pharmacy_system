import config from "../config/env"

// this is the frontend url
const BASE_URL="http://localhost:5173"

// creates gcash payment source in paymongo and returns a redirect url where the user pays
export const createGCashPaymentSourceService = async (amount: number, orderId: string) => {
    const response = await fetch(`${config.PAYMONGO_BASE}/sources`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${config.PAYMONGO_AUTH}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data: {
                attributes: {
                    amount: amount * 100,
                    currency: "PHP",
                    type: "gcash",
                    redirect: {
                        success: `${BASE_URL}/payment/success?order_id=${orderId}`,
                        failed: `${BASE_URL}/payment/failed?order_id=${orderId}`
                    }
                }
            }
        })
    })

    const json = await response.json()

    if (!response.ok) throw new Error(json?.errors?.[0]?.detail ?? "PayMongo error")
    
    return json.data
}

export const createGCashPaymentService = async (sourceId: string, amount: number, orderId: string) => {
    const response = await fetch(`${config.PAYMONGO_BASE}/payments`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${config.PAYMONGO_AUTH}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data: {
                attributes: {
                    amount: amount * 100,
                    currency: "PHP",
                    source: { id: sourceId, type: "source" },
                    description: "Pharmacy"
                }
            }
        })
    })
 
    const json = await response.json()

    if (!response.ok) throw new Error(json.errors?.[0]?.detail || 'Payment error');
    return json.data;
}