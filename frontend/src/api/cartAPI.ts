import type { CartForm, CartItemForm } from "../types/cart"

export const createCartAPI = async (form: CartForm) => {
    const response = await fetch("http://localhost:2000/api/cart/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to create cart")
    }

    return data
}

export const getAllCartAPI = async () => {
    const response = await fetch("http://localhost:2000/api/cart/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to get all cart")
    }

    return data
}

export const updateCartAPI = async (id: string, form: CartItemForm) => {
    const response = await fetch(`http://localhost:2000/api/cart/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to update cart")
    }

    return data
}

export const removeCartItemAPI = async (itemId: string) => {
    const response = await fetch(`http://localhost:2000/api/cart/${itemId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to remove cart")
    }

    return data
}

export const removeAllCartItemAPI = async () => {
    const response = await fetch(`http://localhost:2000/api/cart/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to remove cart")
    }

    return data
}