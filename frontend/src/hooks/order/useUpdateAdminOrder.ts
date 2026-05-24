import { updateAdminOrderAPI } from "../../api/orderAPI"
import { orderFailure, orderStart, orderSuccess } from "../../features/orderSlice"
import type { PaymentStatus, Status } from "../../types/order"
import { useAppDispatch } from "../redux/reduxHooks"

export const useUpdateAdminOrder = () => {
    const dispatch = useAppDispatch()
    const updateAdminOrder = async (id: string, status: Status, paymentStatus: PaymentStatus) => {
        dispatch(orderStart())
        try {
            const data = await updateAdminOrderAPI(id, status, paymentStatus)
            dispatch(orderSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error.message))
        }
    }

    return { updateAdminOrder }
}