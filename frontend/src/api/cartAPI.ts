import type { CartForm } from "../types/cart"
import { getToken } from "../utils/getToken"

export const createCartAPI = async (form: CartForm) => {
    const token = getToken()
    const response = await fetch("http://localhost:2000/api/cart/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to create cart")
    }

    return data
}

export const getAllCartAPI = async (userId: string) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/cart/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to get all cart")
    }

    return data
}

export const updateCartAPI = async (id: string, quantity: number) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/cart/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to update cart")
    }

    return data
}

export const removeCartItemAPI = async (cartId: string, itemId: string) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/cart/item/${cartId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to remove cart")
    }

    return data
}

export const removeSelectedCartItemAPI = async (cartId: string, selectedItemIds: string[]) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/cart/selected-items/${cartId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ selectedItemIds })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to remove selected cart")
    }

    return data
}

export const removeAllCartItemAPI = async (cartId: string) => {
    const token = getToken()
    const response = await fetch(`http://localhost:2000/api/cart/clear/${cartId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data?.error || "Failed to remove cart")
    }

    return data
}