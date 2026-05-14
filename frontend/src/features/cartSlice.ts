import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Product {
    _id: string
    name: string
    price: number
    image?: string
    description?: string
    stock?: number
    category: string
}

export interface CartItem {
    _id: string
    product: Product
    quantity: number
    price: number
}

interface Cart {
    _id: string 
    items: CartItem[]
    totalPrice: number
}

type CartState = {
    cart: Cart | null
    loading: boolean
    error: string | null
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartStart: (state) => {
            state.loading = true
            state.error = null
        },
        cartSuccess: (state, action: PayloadAction<Cart>) => {
            state.loading = false
            state.cart = action.payload
        },
        cartFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        removeAllCartItemSuccess: (state) => {
            state.cart = null
        },
        removeCartItemSuccess: (state, action: PayloadAction<string>) => {
    if (state.cart) {
        state.cart.items = state.cart.items.filter(
            (item) => item._id !== action.payload
        )
    }
}
    }
})

export const {
    cartStart,
    cartSuccess,
    cartFailure,
    removeAllCartItemSuccess,
    removeCartItemSuccess,
} = cartSlice.actions

export default cartSlice.reducer