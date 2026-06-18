import { useEffect, useState } from "react";
import { getOrderStatusDistributionAPI } from "../../api/analyticsAPI";

type OrderStatusItem = {
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    count: number;
};

type ApiResponse = OrderStatusItem[]

export const useGetOrderStatusDistribution = () => {
    const [data, setData] = useState<ApiResponse>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getOrderStatusDistributionAPI()
                setData(result)
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return { data, error, loading }
}