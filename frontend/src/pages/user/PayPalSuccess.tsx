import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getToken } from "../../utils/getToken"
import { useRemoveSelectedCartItem } from "../../hooks/cart/useRemoveSelectedCartItem"
import { getCartId } from "../../utils/getCartId"

export const PayPalSuccess = () => {
  const navigate = useNavigate()
  const hasCaptured = useRef(false)
  const { removeSelectedCartItem } = useRemoveSelectedCartItem()

  const cartId = getCartId()
  const storedSelectedCartItemIds = localStorage.getItem("selectedCartItemIds")
  const parsedSelectedCartItemIds = storedSelectedCartItemIds 
  ?  JSON.parse(storedSelectedCartItemIds) : null
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

        if (cartId) {
          const result = await removeSelectedCartItem(cartId, parsedSelectedCartItemIds)
          if (result) {
            localStorage.removeItem("cartId")
            localStorage.removeItem("selectedCartItemIds")
          }
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