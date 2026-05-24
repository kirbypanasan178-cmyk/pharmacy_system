import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PaymentMethod, PaymentStatus, Status } from "../types/order"
import type { CartItem } from "./cartSlice"

interface ShippingAddress {
  _id: string
  fullname: string
  street: string
  city: string
  province: string
  postalCode: string
  phone: string
}

interface Order {
    _id: string
    userId: string
    items: CartItem
    status: Status
    totalPrice: number
    shippingFee: number
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    shippingAddress: ShippingAddress
    createdAt: string
    updatedAt: string
}

interface OrderState {
    order: Order[]
    loading: boolean
    error: string | null
}

const initialState: OrderState = {
    order: [],
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        orderStart: (state) => {
            state.loading = true
        },
        orderSuccess: (state, action: PayloadAction<Order[]>) => {
            state.loading = false
            state.order = action.payload
        },
        orderFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const {
    orderStart,
    orderSuccess,
    orderFailure
} = orderSlice.actions

export default orderSlice.reducer
