import "../../css/CartCard.css"; // ✅ import directly from slice
import type { CartItem } from "../../features/cartSlice";
import { useRemoveCartItem } from "../../hooks/cart/useRemoveCartItem";

interface CartProps {
    item: CartItem
    checked: boolean
    onSelect: (id: string, checked: boolean) => void
}

export const CartCard = ({ item, checked, onSelect }: CartProps) => {
    const { removeCartItem } = useRemoveCartItem()
    const totalPrice = item.price * item.quantity // ✅ compute it here

    const handleRemoveCartItem = async (id: string) => {
        await removeCartItem(id)
    }
    

    return (
        <div className="cart-card">

            {/* Checkbox */}
            <div className="cart-card__checkbox form-check">
                <input 
                className="form-check-input" 
                type="checkbox" 
                checked={checked}
                onChange={(e) => onSelect(item._id, e.target.checked)}
                />
            </div>

            {/* Image */}
            <div className="cart-card__image-wrap">
                {item.product?.image ? (
                    <img src={item.product.image} alt={item.product?.name ?? "Product"} />
                ) : (
                    <div className="cart-card__image-placeholder">🛍️</div>
                )}
            </div>

            {/* Name + Variation */}
            <div className="cart-card__info">
                <div className="cart-card__name">
                    {item.product?.name ?? "Product Name"} {/* ✅ was item.name */}
                </div>
                <button className="cart-card__variation">
                    Variations &nbsp;▾
                </button>
            </div>

            {/* Unit Price */}
            <div className="cart-card__unit-price">
                <div className="cart-card__price-value">
                    ₱{item.price?.toLocaleString() ?? "0.00"}
                </div>
            </div>

            {/* Quantity */}
            <div className="cart-card__quantity">
                <div className="cart-card__qty-wrap">
                    <button className="cart-card__qty-btn">−</button>
                    <input
                        className="cart-card__qty-value"
                        type="text"
                        value={item?.quantity ?? 1}
                        readOnly
                    />
                    <button className="cart-card__qty-btn">+</button>
                </div>
                <div><span>{item.product.stock}</span></div>
            </div>

            {/* Total Price */}
            <div className="cart-card__total">
                <div className="cart-card__total-value">
                    ₱{totalPrice?.toLocaleString() ?? "0.00"} {/* ✅ computed above */}
                </div>
            </div>

            {/* Actions */}
            <div className="cart-card__actions">
                <button 
                className="cart-card__btn-delete"
                onClick={() => handleRemoveCartItem(item._id)}
                >Delete</button>
                <button className="cart-card__btn-similar">
                    Find Similar ▾
                </button>
            </div>

        </div>
    );
};