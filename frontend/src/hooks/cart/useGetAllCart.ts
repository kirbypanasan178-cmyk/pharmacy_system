import { getAllCartAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, cartSuccess } from "../../features/cartSlice"
import { getCartId } from "../../utils/getCartId"
import { getErrorMessage } from "../../utils/getErrorMessage"
import { getUserId } from "../../utils/getUserId"
import { useAppDispatch } from "../redux/reduxHooks"

export const useGetAllCart = () => {
    const dispatch = useAppDispatch()
    const cartId = getCartId()
    const userId = getUserId()
    const getAllCart = async () => {
        dispatch(cartStart())
        try {
            const data = await getAllCartAPI(userId)
            dispatch(cartSuccess(data))
            if (!cartId) {
                localStorage.setItem("cartId", data._id)
            }
            return data
        } catch (error: unknown) {
            console.log(error)
            const errorMessage = getErrorMessage(error)
            dispatch(cartFailure(errorMessage))
        }
    }

    return { getAllCart }
}