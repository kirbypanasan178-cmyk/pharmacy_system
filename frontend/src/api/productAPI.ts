import type { ProductFormType } from "../types/product"
import { getToken } from "../utils/getToken"

export const createProductAPI = async (form: ProductFormType) => {
    const token = getToken()
    const formData = new FormData()

    formData.append("name", form.name)
    formData.append("price", String(form.price))
    formData.append("description", form.description)
    formData.append("category", form.category)
    formData.append("stock", String(form.stock))

    if (form.image) {
        formData.append("image", form.image)
    }

    const response = await fetch("http://localhost:2000/api/product/", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })

    const data = await response.json()

     if (!response.ok) {
        throw new Error(data?.error || "Failed to create product");
    }

    return data
}

export const getAllProductAPI = async () => {
    const token = getToken()
    const response = await fetch("http://localhost:2000/api/product/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products")
    }

    return data
}

export const updateProductAPI = async (id: string, form: ProductFormType) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/product/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}

export const deleteProductAPI = async (id: string) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/product/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}