import { updateAdminOrderAPI } from "../../api/orderAPI"
import { getOrderFailure, getOrderStart, updateOrderByIdSuccess } from "../../features/orderSlice"
import type { PaymentStatus, Status } from "../../types/order"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateAdminOrder = () => {
    const dispatch = useAppDispatch()
    const updateAdminOrder = async (id: string, status: Status, paymentStatus: PaymentStatus) => {
        dispatch(getOrderStart())
        try {
            const data = await updateAdminOrderAPI(id, status, paymentStatus)
            dispatch(updateOrderByIdSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(getOrderFailure(error.message))
        }
    }

    return { updateAdminOrder }
}