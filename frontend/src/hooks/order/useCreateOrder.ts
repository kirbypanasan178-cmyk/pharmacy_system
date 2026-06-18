import { createOrderAPI } from "../../api/orderAPI"
import { getAllOrderSuccess, getOrderFailure, getOrderStart } from "../../features/orderSlice"
import type { AddressFormType, PaymentMethod } from "../../types/order"
import { useAppDispatch } from "../redux/reduxHooks"

export const useCreateOrder = () => {
    const storedUser = localStorage.getItem("user")
    const parsedUser = storedUser ? JSON.parse(storedUser) : null
    const dispatch = useAppDispatch()
    const createOrder = async (form: AddressFormType, paymentMethod: PaymentMethod) => {
        dispatch(getOrderStart())
        try {
            const data = await createOrderAPI(parsedUser.user._id, form, paymentMethod)
            console.log("Data:", data)
            dispatch(getAllOrderSuccess(data))
            return data
        } catch (error: any) {
            console.log(error)
            dispatch(getOrderFailure(error.message))
        }
    }

    return { createOrder }
}