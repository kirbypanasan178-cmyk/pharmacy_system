import { useEffect, useState } from "react"
import { getTop3CategoriesAPI } from "../../api/analyticsAPI"

interface TopCategory {
    category: string
    totalSold: number
}

export const useGetTop3Categories = () => {
    const [data, setData] = useState<TopCategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getTop3CategoriesAPI()
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