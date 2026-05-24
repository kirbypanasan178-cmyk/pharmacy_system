export interface AddressType {
    fullname: string
    phone: string
    street: string
    city: string
    province: string
    postalCode: string
}

export interface OrderItem {
    product: string
    quantity: number
    price: number
}

export interface Order {
    items: OrderItem[]
    paymentMethod: string
    shippingAddress: AddressType
}

export type PaymentMethod  = "cod" | "gcash" | "card"

export type Status = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type PaymentStatus = "unpaid" | "paid" | "refunded"