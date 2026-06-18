import { updateUserOrderAPI } from "../../api/orderAPI"
import { getOrderFailure, getOrderStart, updateOrderByIdSuccess } from "../../features/orderSlice"
import type { Status } from "../../types/order"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateUserOrder = () => {
    const dispatch = useAppDispatch()
    const updateUserOrder = async (id: string, status: Status) => {
        dispatch(getOrderStart())
        try {
            const data = await updateUserOrderAPI(id, status)
            dispatch(updateOrderByIdSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(getOrderFailure(error.message))
        }
    }

    return { updateUserOrder }
}