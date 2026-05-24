import { removeAllCartItemAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, removeAllCartItemSuccess,  } from "../../features/cartSlice"
import { useAppDispatch } from "../redux/reduxHooks"


export const useRemoveAllCartItem = () => {
    const dispatch = useAppDispatch()
    const removeAllCartItem = async (cartId: string) => {
        dispatch(cartStart())
        try {
            await removeAllCartItemAPI(cartId)
            dispatch(removeAllCartItemSuccess())
        } catch (error: any){
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to delete cart"))
        }
    }

    return { removeAllCartItem }
}