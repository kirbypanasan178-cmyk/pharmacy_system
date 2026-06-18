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
    items: CartItem[]
    status: Status
    totalPrice: number
    shippingFee: number
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    shippingAddress: ShippingAddress
    createdAt: string
    updatedAt: string
    shippedAt: string
    deliveredAt: string
    cancelledAt: string
    paid: string
    refunded: string
}

interface OrderState {
    userOrders: Order[]
    adminOrders: Order[]
    loading: boolean
    error: string | null
}

const initialState: OrderState = {
    userOrders: [],
    adminOrders: [],
    loading: false,
    error: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        getOrderStart: (state) => {
            state.loading = true
        },
        getOrderByIdSuccess: (state, action: PayloadAction<Order[]>) => {
            state.loading = false
            state.userOrders = action.payload
        },
        getAllOrderSuccess: (state, action: PayloadAction<Order[]>) => {
            state.loading = false
            state.adminOrders = action.payload
        },
        updateOrderByIdSuccess: (state, action: PayloadAction<Order>) => {
            const index = state.adminOrders.findIndex((o) =>
                o._id === action.payload._id
            )

            if (index !== -1) {
                state.adminOrders[index] = action.payload
            }
        },
        getOrderFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const {
    getOrderStart,
    getOrderByIdSuccess,
    getAllOrderSuccess,
    updateOrderByIdSuccess,
    getOrderFailure,
} = orderSlice.actions

export default orderSlice.reducer
