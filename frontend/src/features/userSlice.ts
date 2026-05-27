import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface User {
    _id: string
    fullname: string
    age: number
    gender: "male" | "female" | "other"
    birthdate: string
    birthplace: string
    address: {
        street: string
        barangay: string
        city: string
        province: string
        zipcode: string
    }
    email: string
    role: string
    isActive: boolean
    createdAt: string
    totalOrders: number
}

interface UserState {
    users: User[]
    loading: boolean
    error: string | null
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        userStart: (state) => {
            state.loading = true
        },
        userSuccess: (state, action: PayloadAction<User[]>) => {
            state.loading = false
            state.users = action.payload
        },
        updateUserSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false
            const index = state.users.findIndex(
                (user) => user._id === action.payload._id
            )

            if (index !== -1) {
                state.users[index] = action.payload
            }
        },
        userFailed: (state, action: PayloadAction<string | null>) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const {
    userStart,
    userSuccess,
    updateUserSuccess,
    userFailed
} = userSlice.actions

export default userSlice.reducer