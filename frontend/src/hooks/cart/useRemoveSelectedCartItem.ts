import { removeSelectedCartItemAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, removeSelectedCartItemSuccess } from "../../features/cartSlice"
import { useAppDispatch } from "../redux/reduxHooks"

export const useRemoveSelectedItem = () => {
    const dispatch = useAppDispatch()
    const removeSelectedCartItem = async (cartId: string, selectedItemIds: string[]) => {
        dispatch(cartStart())
        try {
            await removeSelectedCartItemAPI(cartId, selectedItemIds)
            dispatch(removeSelectedCartItemSuccess(selectedItemIds))
        } catch (error: any) {
            dispatch(cartFailure(error.message))
            console.log(error.message)
        }
    }

    return { removeSelectedCartItem }
}