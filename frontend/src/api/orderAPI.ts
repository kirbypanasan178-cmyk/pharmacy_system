import type { AddressFormType, PaymentMethod, PaymentStatus, Status } from "../types/order"

export const createOrderAPI = async (shippingAddress: AddressFormType, paymentMethod: PaymentMethod) => {
    const response = await fetch("http://localhost:2000/api/order/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            shippingAddress,
            paymentMethod
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}

export const getAllOrderAPI = async () => {
    const response = await fetch("http://localhost:2000/api/order/", {
        method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}

export const getOrderAPI = async (id: string) => {
    const response = await fetch(`http://localhost:2000/api/order/${id}`, {
        method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}

export const updateAdminOrderAPI = async (id: string, status: Status, paymentStatus: PaymentStatus) => {
    const response = await fetch(`http://localhost:2000/api/order/admin/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status,
            paymentStatus
        })
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}

export const updateUserOrderAPI = async (id: string, status: Status) => {
    const response = await fetch(`http://localhost:2000/api/order/user/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({status})
    })
    

    const data = await response.json()

    
    

    if (!response.ok) {
        throw new Error(data.error)
    }

    return data
}