import { removeCartItemAPI } from "../../api/cartAPI"
import { cartFailure, removeCartItemSuccess } from "../../features/cartSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useRemoveCartItem = () => {
    const dispatch = useAppDispatch()
    const removeCartItem = async (cartId: string, itemId: string) => {
        try {
            await removeCartItemAPI(cartId, itemId)
            dispatch(removeCartItemSuccess(itemId))
        } catch (error: any){
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to delete cart"))
        }
    }

    return { removeCartItem }
}