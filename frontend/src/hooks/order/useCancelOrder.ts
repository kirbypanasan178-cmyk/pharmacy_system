import { useState } from "react"
import { cancelOrderAPI } from "../../api/orderAPI"
import { useAppDispatch } from "../redux/reduxHooks"
import { updateOrderByIdSuccess } from "../../features/orderSlice"

export const useCancelOrder = () => {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()

    const cancelOrder = async (orderId: string) => {
        setLoading(true)
        setError(null)
        try {
            const data = await cancelOrderAPI(orderId)
            dispatch(updateOrderByIdSuccess(data.order))
        } catch (error: any) {
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { cancelOrder, error, loading}
}