import { createOrderAPI } from "../../api/orderAPI"
import { getAllOrderSuccess, getOrderFailure, getOrderStart } from "../../features/orderSlice"
import type { AddressFormType, PaymentMethod } from "../../types/order"
import { clearIdempotencyKey, createIdempotencyKey } from "../../utils/idempotencyKey"
import { useAppDispatch } from "../redux/reduxHooks"

export const useCreateOrder = () => {
    const storedUser = localStorage.getItem("user")
    const parsedUser = storedUser ? JSON.parse(storedUser) : null
    const dispatch = useAppDispatch()
    const createOrder = async (form: AddressFormType, paymentMethod: PaymentMethod) => {
        dispatch(getOrderStart())
        try {
            const idempotencyKey = createIdempotencyKey()

            const data = await createOrderAPI(
                parsedUser.user._id, 
                form, 
                paymentMethod,
                idempotencyKey,
            )
            dispatch(getAllOrderSuccess(data))

            clearIdempotencyKey()

            return data
        } catch (error: any) {
            console.log(error)
            dispatch(getOrderFailure(error.message))
            throw error
        }
    }

    return { createOrder }
}
