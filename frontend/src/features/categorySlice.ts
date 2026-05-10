import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Category {
    _id: string;
    name: string;
    description: string;
}

interface CategoryState {
    categories: Category[];
    error: string | null;
    loading: boolean;
}

const initialState: CategoryState = {
    categories: [],
    error: null,
    loading: false,
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        createCategoryStart: (state) => {
            state.loading = true
        },
        createCategorySuccess: (state, action: PayloadAction<Category>) => {
            state.loading = false
            state.categories.push(action.payload)
        },
        createCategoryFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
        getAllCategoryStart: (state) => {
            state.loading = true
        },
        getAllCategorySuccess: (state, action: PayloadAction<Category[]>) => {
            state.loading = false
            state.categories = action.payload
        },
        getAllCategoryFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
        updateCategoryStart: (state) => {
            state.loading = true
        },
        updateCategorySuccess: (state, action: PayloadAction<Category   >) => {
            state.loading = false
            state.categories.filter(
                (cat) => cat._id !== action.payload._id
            )
        },
        updateCategoryFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = true
            state.error = action.payload
        },
        deleteCategoryStart: (state) => {
            state.loading = true
        },

        deleteCategorySuccess: (state, action: PayloadAction<string>) => {
            state.loading = false

            state.categories = state.categories.filter(
                (cat) => cat._id !== action.payload
            )
        },

        deleteCategoryFailure: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        },
    }
})

export const {
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailure,
    getAllCategoryStart,
    getAllCategorySuccess,
    getAllCategoryFailure,
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailure,
} = categorySlice.actions

export default categorySlice.reducer