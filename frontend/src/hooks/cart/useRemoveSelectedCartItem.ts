import { removeSelectedCartItemAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, removeSelectedCartItemSuccess } from "../../features/cartSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useRemoveSelectedCartItem = () => {
    const dispatch = useAppDispatch()
    const removeSelectedCartItem = async (cartId: string, selectedItemIds: string[]) => {
        dispatch(cartStart())
        try {
            const data = await removeSelectedCartItemAPI(cartId, selectedItemIds)
            dispatch(removeSelectedCartItemSuccess(selectedItemIds))
            
            return data
        } catch (error: any) {
            dispatch(cartFailure(error.message))
            console.log(error.message)
        }
    }

    return { removeSelectedCartItem }
}