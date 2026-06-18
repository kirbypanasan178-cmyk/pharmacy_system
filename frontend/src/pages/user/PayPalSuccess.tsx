import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useRemoveAllCartItem } from "../../hooks/cart/useRemoveAllCartItem"
import { useAppSelector } from "../../hooks/redux/reduxHooks"
import { getToken } from "../../utils/getToken"

export const PayPalSuccess = () => {
  const navigate = useNavigate()
  const hasCaptured = useRef(false)
   const cart = useAppSelector((state) => state.cart.cart)
   const { removeAllCartItem } = useRemoveAllCartItem()

  useEffect(() => {
    const capture = async () => {
      if (hasCaptured.current) return
      hasCaptured.current = true

      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")
      const authToken = getToken()

      if (!token) return

      try {
        const res = await fetch("http://localhost:2000/api/order/paypal/capture", {
          method: "POST",
          headers: 
            { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`
            },
      
          credentials: "include",
          body: JSON.stringify({ orderId: token }),
        })

        await res.json()

        if (cart?._id) {
          await removeAllCartItem(cart._id) // 👈 clear cart after successful capture
        }
        navigate("/home")
      } catch (err: unknown) {
        console.error("Capture failed:", err)
        navigate("/home")
      }
    }

    capture()
  }, [])

  return (
    <div>Processing your payment, please wait...</div>
  )
}