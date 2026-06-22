import { useState } from "react"
import { createGCashPaymentSourceAPI } from "../../api/paymentAPI"

export const useCreateGCashPaymentSource = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>()

    const createGCashPaymentSource = async (orderId: string, amount: number) => {
        try {
            const { checkoutUrl } = await createGCashPaymentSourceAPI(orderId, amount) 
            window.location.href = checkoutUrl
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { createGCashPaymentSource, loading, error }
}