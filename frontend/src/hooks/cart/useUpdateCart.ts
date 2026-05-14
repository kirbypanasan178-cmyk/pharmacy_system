import { updateCartAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, cartSuccess } from "../../features/cartSlice"
import type { CartItemForm } from "../../types/cart"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateCart = () => {
    const dispatch = useAppDispatch()
    const updateCart = async (id: string, form: CartItemForm) => {
        dispatch(cartStart())
        try {
            const data = await updateCartAPI(id, form)
            dispatch(cartSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to update cart"))
        }
    }

    return { updateCart }
}