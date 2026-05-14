import { CartCard } from "../../components/cards/CartCard";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/Card.css";
import { useState } from "react";

export const Cart = () => {
  const { cart, loading, error } = useAppSelector((state) => state.cart);

  // state that holds the Ids of the cart
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const items = cart?.items ?? [];
  console.log("cart:", cart);
  console.log("items:", items);

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const selectedItems = items.filter((item) => selectedIds.has(item._id))

  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.price, 0
  )
  // if checked, collect every id of the cart and put it into Set
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(items.map((item) => item._id)))
        } else {
            setSelectedIds(new Set())
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            checked ? next.add(id) : next.delete(id)
            return next
        })
    }

  return (
    <div className="cart-page">
      {/* Header Row */}
      <div className="cart-header">
        <div className="cart-header__check">
          <input 
          type="checkbox" 
          className="form-check-input" 
          checked={allSelected}
          onChange={handleSelectAll}
          />
          <span>Product</span>
        </div>
        <div className="cart-header__cols">
          <span>Unit Price</span>
          <span>Quantity</span>
          <span>Total Price</span>
          <span>Actions</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="cart-list">
        {items.length === 0 ? (
          <div className="cart-empty">
            <span>🛒</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          items.map((item) => (
            <CartCard 
            key={item._id} 
            item={item} 
            checked={selectedIds.has(item._id)}
            onSelect={handleSelectOne}
            /> // pass item not cart
          ))
        )}
      </div>

      {/* Footer */}
      <div className="cart-footer">
        <div className="cart-footer__left">
          <input type="checkbox" className="form-check-input" />
          <span>Select All ({items.length})</span>
          <button className="cart-footer__btn-delete">Delete</button>
        </div>
        <div className="cart-footer__right">
          <div className="cart-footer__total-wrap">
            <span>
              Total ({selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}):
            </span>
            <span className="cart-footer__total-price">
              ₱{selectedTotal.toLocaleString() ?? 0}
            </span>
          </div>
          <button className="cart-footer__btn-checkout">Check Out</button>
        </div>
      </div>
    </div>
  );
};
