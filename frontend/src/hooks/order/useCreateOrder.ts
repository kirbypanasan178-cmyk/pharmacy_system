import { createOrderAPI } from "../../api/orderAPI"
import { orderFailure, orderStart, orderSuccess } from "../../features/orderSlice"
import type { AddressFormType, PaymentMethod } from "../../types/order"
import { useAppDispatch } from "../redux/reduxHooks"

export const useCreateOrder = () => {
    const dispatch = useAppDispatch()
    const createOrder = async (form: AddressFormType, paymentMethod: PaymentMethod) => {
        dispatch(orderStart())
        try {
            const data = await createOrderAPI(form, paymentMethod)
            console.log("Data:", data)
            dispatch(orderSuccess(data))
        } catch (error: any) {
            console.log(error)
            dispatch(orderFailure(error.message))
        }
    }

    return { createOrder }
}