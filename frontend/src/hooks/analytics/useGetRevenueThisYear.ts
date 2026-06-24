import { useEffect, useState } from "react"
import { getRevenueThisYearAPI } from "../../api/analyticsAPI"

interface RevenueMonth {
    month: string
    revenue: number
}

export const useGetRevenueThisYear = () => {
    const [data, setData] = useState<RevenueMonth[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getRevenueThisYearAPI()
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