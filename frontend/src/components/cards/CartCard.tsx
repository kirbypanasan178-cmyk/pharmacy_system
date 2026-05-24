import { useState } from "react";
import "../../css/CartCard.css";
import type { CartItem } from "../../features/cartSlice";
import { useRemoveCartItem } from "../../hooks/cart/useRemoveCartItem";
import { useUpdateCart } from "../../hooks/cart/useUpdateCart";

interface CartProps {
    item: CartItem
    checked: boolean
    onSelect: (id: string, checked: boolean) => void
}

export const CartCard = ({ item, checked, onSelect }: CartProps) => {
    const { removeCartItem } = useRemoveCartItem()
    const { updateCart } = useUpdateCart()

    const [count, setCount] = useState<number>(item.quantity ?? 1)
    const [totalPrice, setTotalPrice] = useState(item.price * (item.quantity ?? 1))

    const handleRemoveCartItem = async (id: string) => {
        await removeCartItem(id)
    }

    const handleQuantityChange = async (newCount: number) => {
        if (newCount < 1) return
        setCount(newCount)
        setTotalPrice(item.price * newCount)
        await updateCart(item._id, newCount)
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
                    {item.product?.name ?? "Product Name"}
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
                    <button
                        className="cart-card__qty-btn"
                        onClick={() => handleQuantityChange(Math.max(count - 1, 1))}
                    >−</button>
                    <input
                        className="cart-card__qty-value"
                        type="text"
                        value={count}
                        readOnly
                    />
                    <button
                        className="cart-card__qty-btn"
                        onClick={() => handleQuantityChange(count + 1)}
                    >+</button>
                </div>
                <div><span>{item.product.stock}</span></div>
            </div>

            {/* Total Price */}
            <div className="cart-card__total">
                <div className="cart-card__total-value">
                    ₱{totalPrice.toLocaleString()}
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