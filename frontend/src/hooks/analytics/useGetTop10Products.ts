import { useEffect, useState } from "react"
import { getTop10ProductsAPI } from "../../api/analyticsAPI"

interface TopProduct {
    name: string
    price: number
    totalSold: number
    revenue: number
}

export const useGetTop10Products = () => {
    const [data, setData] = useState<TopProduct[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTop10ProductsAPI()
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