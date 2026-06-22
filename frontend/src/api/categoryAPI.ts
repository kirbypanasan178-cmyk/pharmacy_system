import type { CategoryFormType } from "../types/category"
import { getToken } from "../utils/getToken"

export const createCategoryAPI = async (form: CategoryFormType) => {
    const token = getToken()
    const response = await fetch("http://localhost:2000/api/category/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to create category")
    }

    return data
}

export const getAllCategoryAPI = async () => {
    const token = getToken()
    const response = await fetch("http://localhost:2000/api/category/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to get  all category")
    }

    return data
}

export const updateCategoryAPI = async (id: string, form: CategoryFormType) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/category/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to update category")
    }

    return data
}

export const deleteCategoryAPI = async (id: string) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/category/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to delete category")
    }

    return data
}