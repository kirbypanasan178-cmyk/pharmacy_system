import { useRef, useState } from "react"
import { createCartAPI } from "../../api/cartAPI"
import { cartFailure, cartStart, cartSuccess } from "../../features/cartSlice"
import type { CartForm } from "../../types/cart"
import { useAppDispatch } from "../redux/reduxHooks"
import { getCartId } from "../../utils/getCartId"

export const useCreateCart = () => {
    const dispatch = useAppDispatch()
    const cartId = getCartId()
    const lastClickRef = useRef<number>(0)
    const [throttled, setThrottled] = useState(false)
    const THROTTLE_MS = 2000

    const createCart = async (form: CartForm) => {
        const now = Date.now()

        if (now - lastClickRef.current < THROTTLE_MS) return

        lastClickRef.current = now
        setThrottled(true)

        dispatch(cartStart())
        try {
            const data = await createCartAPI(form)
            dispatch(cartSuccess(data))
            
            if (!cartId) {
                localStorage.setItem("cartId", data._id)
            }

            return data

        } catch (error: any) {
            console.log(error)
            dispatch(cartFailure(error.message || "Failed to create cart"))
        } finally {
            setTimeout(() => setThrottled(false), THROTTLE_MS)
        }
    }

    return { createCart, throttled }
}