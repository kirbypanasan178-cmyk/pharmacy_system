import { useEffect, useState } from "react"
import { getOrderSummaryThisWeekAPI } from "../../api/analyticsAPI"

interface ApiResponse {
    labels: string[]
    values: number[]
}

export const useGetOrderSummaryThisWeek = () => {
    const [data, setData] = useState<ApiResponse>({ labels: [], values: [] })
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getOrderSummaryThisWeekAPI()
                setData(result)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { data, loading, error }
}