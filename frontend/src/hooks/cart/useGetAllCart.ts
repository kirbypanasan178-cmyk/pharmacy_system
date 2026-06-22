import { getAllCartAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, cartSuccess } from "../../features/cartSlice"
import { getCartId } from "../../utils/getCartId"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllCart = () => {
    const dispatch = useAppDispatch()
    const cartId = getCartId()
    const getAllCart = async (userId: string) => {
        dispatch(cartStart())
        try {
            const data = await getAllCartAPI(userId)
            dispatch(cartSuccess(data))
            if (!cartId) {
                localStorage.setItem("cartId", data._id)
            }
            return data
        } catch (error: any) {
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to get cart"))
        }
    }

    return { getAllCart }
}