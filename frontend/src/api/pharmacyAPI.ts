import type { PharmacyLocationForm } from "../types/pharmacy"
import { getToken } from "../utils/getToken"

const API_URL = "http://localhost:2000/api/pharmacy"

const parseJSON = async (response: Response) => {
    return response.json().catch(() => ({ error: "Unexpected server error" }))
}

export const createPharmacyAPI = async (form: PharmacyLocationForm) => {
    const token = getToken()
    const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })

    const data = await parseJSON(response)
    if (!response.ok) throw new Error(data.error)
    return data
}

export const getPharmacyByIdAPI = async (pharmacyId: string) => {
    const token = getToken()
    const response = await fetch(`${API_URL}/${pharmacyId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })

    const data = await parseJSON(response)
    if (!response.ok) throw new Error(data.error)
    return data
}

export const getAllPharmaciesAPI = async () => {
    const token = getToken()
    console.log("Token:", token) // 👈 add this
    if (!token) {
        throw new Error("No auth token found. Please log in.")
    }
    const response = await fetch(`${API_URL}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })

    const data = await parseJSON(response)
    if (!response.ok) throw new Error(data.error)
    return data
}

export const updatePharmacyAPI = async (pharmacyId: string, form: Partial<PharmacyLocationForm>) => {
    const token = getToken()
    const response = await fetch(`${API_URL}/${pharmacyId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })

    const data = await parseJSON(response)
    if (!response.ok) throw new Error(data.error)
    return data
}

export const deletePharmacyAPI = async (pharmacyId: string) => {
    const token = getToken()
    const response = await fetch(`${API_URL}/${pharmacyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    })

    const data = await parseJSON(response)
    if (!response.ok) throw new Error(data.error)
    return data
}