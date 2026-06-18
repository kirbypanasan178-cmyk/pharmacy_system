import { useState } from "react"
import { createPharmacyAPI } from "../../api/pharmacyAPI"
import type { PharmacyLocationForm } from "../../types/pharmacy"

interface ApiResponse {
    _id: string
    name: string
    address: string
    phone: string
    location: {
        lat: number
        lng: number
    }
}

export const useCreatePharmacy = () => {
    const [data, setData] = useState<ApiResponse | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    const createPharmacy = async (form: PharmacyLocationForm) => {
        try {
            const result = await createPharmacyAPI(form)
            setData(result)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { createPharmacy, data, loading, error }
}