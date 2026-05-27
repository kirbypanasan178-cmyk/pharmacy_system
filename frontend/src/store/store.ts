import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"
import productReducer from "../features/productSlice"
import categoryReducer from "../features/categorySlice"
import cartReducer from "../features/cartSlice"
import orderReducer from "../features/orderSlice"
import userReducer from "../features/userSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        category: categoryReducer,
        cart: cartReducer,
        order: orderReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch