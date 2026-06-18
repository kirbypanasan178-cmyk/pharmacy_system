import { useEffect, useState } from "react"
import { getAllPharmaciesAPI } from "../../api/pharmacyAPI"


interface ApiResponse {
    _id: string
    name: string
    address: string
    phone: string
    isOpen: boolean
    location: {
        lat: number
        lng: number
    }
}

export const useGetAllPharmacies = () => {
    const [data, setData] = useState<ApiResponse[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const fetchData = async () => {
        try {
            const result = await getAllPharmaciesAPI()
            setData(result)
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