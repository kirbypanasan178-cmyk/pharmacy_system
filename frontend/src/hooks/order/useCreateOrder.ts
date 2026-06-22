import { createOrderAPI } from "../../api/orderAPI"
import { getAllOrderSuccess, getOrderFailure, getOrderStart } from "../../features/orderSlice"
import type { AddressFormType, PaymentMethod } from "../../types/order"
import { getErrorMessage } from "../../utils/getErrorMessage"
import { getUserId } from "../../utils/getUserId"
import { clearIdempotencyKey, createIdempotencyKey } from "../../utils/idempotencyKey"
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks"

export const useCreateOrder = () => {
    const selectedCartItemIds = useAppSelector((state) => state.cart.selectedCartItemIds)
    const dispatch = useAppDispatch()
    const createOrder = async (
        form: AddressFormType, 
        paymentMethod: PaymentMethod,
    ) => {
        dispatch(getOrderStart())
        try {
            const userId = getUserId()

            const idempotencyKey = createIdempotencyKey()

            const data = await createOrderAPI(
                userId,
                form, 
                paymentMethod,
                selectedCartItemIds,
                idempotencyKey,
            )
            dispatch(getAllOrderSuccess(data))

            clearIdempotencyKey()

            return data
        } catch (error: unknown) {
            console.log(error)
            const message = getErrorMessage(error)
            dispatch(getOrderFailure(message))
            throw error
        }
    }

    return { createOrder }
}
