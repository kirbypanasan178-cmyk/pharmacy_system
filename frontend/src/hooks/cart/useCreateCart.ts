import { createCartAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, cartSuccess } from "../../features/cartSlice"
import type { CartForm } from "../../types/cart"
import { useAppDispatch } from "../redux/reduxHooks"

export const useCreateCart = () => {
    const dispatch = useAppDispatch()

    const createCart = async (form: CartForm) => {
        dispatch(cartStart())
        try {
            const data = await createCartAPI(form)
            dispatch(cartSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to create cart"))
        }
    }

    return { createCart }
}