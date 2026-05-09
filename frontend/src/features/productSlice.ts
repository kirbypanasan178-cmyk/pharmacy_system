import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    category: string;
    stock: number;
}

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        createProductStart: (state) => {
            state.loading = true
        },
        createProductSuccess: (state, action: PayloadAction<Product>) => {
            state.loading = false
            state.products.push(action.payload)
        },
        createProductFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
        getAllProductStart: (state) => {
            state.loading = true
        },
        getAllProductSuccess: (state, action: PayloadAction<Product[]>) => {
            state.loading = false
            state.products = action.payload
        },
        getALlProductFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
        updateProductStart: (state) => {
            state.loading = true
        },
        updateProductSuccess: (state, action: PayloadAction<Product>) => {
            state.loading = false
            
            const index = state.products.findIndex(
                (p) => p._id === action.payload._id
            )

            if (index !== -1) {
                state.products[index] = action.payload
            }
        },
        updateProductFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
        deleteProductStart: (state) => {
            state.loading = true
        },
        deleteProductSuccess: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.products = state.products.filter(
                (p) => p._id !== action.payload
            )
        },
        deleteProductFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
    }
})

export const {
    createProductStart,
    createProductSuccess,
    createProductFailure,
    getAllProductStart,
    getAllProductSuccess,
    getALlProductFailure,
    updateProductStart,
    updateProductSuccess,
    updateProductFailure,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFailure,
} = productSlice.actions

export default productSlice.reducer
