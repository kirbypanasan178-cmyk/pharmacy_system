import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getSelectedCartItemIds } from "../../utils/getCartId";
import { getUserId } from "../../utils/getUserId";
import { useRemoveSelectedCartItem } from "../../hooks/cart/useRemoveSelectedCartItem";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const { removeSelectedCartItem } = useRemoveSelectedCartItem();
  const userId = getUserId();
  const selectedCartItemIds = getSelectedCartItemIds();

  useEffect(() => {
    // Give webhook time to process, then redirect to orders
    setTimeout(() => navigate("/account/orders"), 3000);
    const removeOrders = async () => {
      const result = await removeSelectedCartItem(userId, selectedCartItemIds);
      console.log("Result: :", result);
      if (!result) {
        console.error("Cannot remove selected cart item");
        return
      }

      localStorage.removeItem("selectedCartItemIds");
    };

    removeOrders()
  }, []);

  return (
    <div className="text-center py-5">
      <h4 style={{ color: "#1D9E75" }}>GCash payment successful!</h4>
      <p className="text-muted">Redirecting to your orders...</p>
    </div>
  );
}
