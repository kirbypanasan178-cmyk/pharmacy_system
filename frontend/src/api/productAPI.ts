import type { ProductFormType } from "../types/product"

export const createProductAPI = async (form: ProductFormType) => {

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
        body: formData
    })

    const data = await response.json()

     if (!response.ok) {
        throw new Error(data?.error || "Failed to create product");
    }

    return data
}

export const getAllProductAPI = async () => {
    const response = await fetch("http://localhost:2000/api/product/", {
        method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch products")
    }

    return data
}

export const updateProductAPI = async (id: string, form: ProductFormType) => {
    const response = await fetch(`http://localhost:2000/api/product/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
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
    const response = await fetch(`http://localhost:2000/api/product/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}