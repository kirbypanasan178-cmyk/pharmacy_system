import type { CartItem } from "../features/cartSlice"

export type PaymentMethod  = "cod" | "gcash" | "card" | "paypal"

export type Status = "pending" | "shipped" | "delivered" | "cancelled"

export type PaymentStatus = "unpaid" | "paid" | "refunded"

export interface AddressFormType {
    fullname: string
    phone: string
    street: string
    city: string
    province: string
    postalCode: string
}

export const addressInitialForm: AddressFormType = {
    fullname: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
}


export interface OrderItem {
    product: string
    quantity: number
    price: number
}

export interface Order {
    items: OrderItem[]
    paymentMethod: string
    shippingAddress: AddressFormType
}

export interface OrderModalProps {
  items: CartItem[];
  shippingFee?: number;
  isOpen: boolean;
  onClose: () => void;
}
