import { updateCartAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, updateCartItemSuccess } from "../../features/cartSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateCart = () => {
    const dispatch = useAppDispatch()
    const updateCart = async (id: string, quantity: number) => {

        try {
            const data = await updateCartAPI(id, quantity)
             if (!data) {
                // Backend returned null — just stop loading, don't update state
                dispatch(cartStart()) // reset loading
                return
            }
            console.log("updateCartAPI response:", data)
            dispatch(updateCartItemSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to update cart"))
        }
    }

    return { updateCart }
}