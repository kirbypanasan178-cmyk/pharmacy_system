import config from "../config/env"


export const getPayPalAccessToken = async (): Promise<string> => {
    const credentials = Buffer.from(
        `${config.PAYPAL_CLIENT_ID}:${config.PAYPAL_CLIENT_SECRET}`
    ).toString("base64")

    // send the request from the server to paypal and get the access token
    const response = await fetch(`${config.PAYPAL_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials"
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(`PayPal auth failed: ${data.error_description}`)
    }

    return data.access_token
    } 

export const createPayPalOrder = async (amount: string) => {
    const token = await getPayPalAccessToken()
    
    const response = await fetch(`${config.PAYPAL_BASE}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "PHP",
                            value: amount
                        }
                    }
                ],
                 payment_source: {
        paypal: {
            experience_context: {
                return_url: "http://localhost:5173/paypal-success",
                cancel_url: "http://localhost:5173/cart"
            }
        }
    }
            })
        }
    )

    const data = await response.json()

     console.log(data)

    if (!response.ok) {
        throw new Error(data.message || "PayPal order creation failed")
    }

   

    return data
}