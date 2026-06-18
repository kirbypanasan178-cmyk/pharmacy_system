import { useEffect, useState } from "react"
import { getWeeklyRevenueAPI } from "../../api/analyticsAPI"

type ApiResponse = {
    day: string[]
    revenue: number[]
}

export const useGetWeeklyRevenue = () => {
    const [data, setData] = useState<ApiResponse | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getWeeklyRevenueAPI()
                console.log("Weekly revenue: ", result)
                setData({
                    day: result.map((r: { day: string; revenue: number }) => r.day),
                    revenue: result.map((r: { day: string; revenue: number }) => r.revenue),
                })
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return { data, loading, error }
}