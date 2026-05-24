import { updateUserOrderAPI } from "../../api/orderAPI"
import { orderFailure, orderStart, orderSuccess } from "../../features/orderSlice"
import type { Status } from "../../types/order"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateUserOrder = () => {
    const dispatch = useAppDispatch()
    const updateUserOrder = async (id: string, status: Status) => {
        dispatch(orderStart())
        try {
            const data = await updateUserOrderAPI(id, status)
            dispatch(orderSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error.message))
        }
    }

    return { updateUserOrder }
}