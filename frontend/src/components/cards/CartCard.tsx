import { useState } from "react";
import "../../css/CartCard.css";
import type { CartItem } from "../../features/cartSlice";
import { useRemoveCartItem } from "../../hooks/cart/useRemoveCartItem";
import { useUpdateCart } from "../../hooks/cart/useUpdateCart";
import { useAppSelector } from "../../hooks/redux/reduxHooks";

interface CartProps {
    item: CartItem
    checked: boolean
    onSelect: (id: string, checked: boolean) => void
}

export const CartCard = ({ item, checked, onSelect }: CartProps) => {
    const { removeCartItem } = useRemoveCartItem()
    const { updateCart } = useUpdateCart()
    const cart = useAppSelector((state) => state.cart.cart)

    const [count, setCount] = useState<number>(item.quantity ?? 1)
    const [totalPrice, setTotalPrice] = useState(item.price * (item.quantity ?? 1))

    const stock = item.product.stock ?? 0
    const isAtStockLimit = count >= stock

    const handleRemoveCartItem = async (cartId: string, itemId: string) => {
    console.log("Removing:", { cartId, itemId })
    console.log("Current items:", cart?.items.map(i => i._id))
    await removeCartItem(cartId, itemId)
    console.log("After remove, items:", cart?.items.map(i => i._id))
}

    const handleQuantityChange = async (newCount: number) => {
        if (newCount < 1) return
        if (newCount > stock) return
        setCount(newCount)
        setTotalPrice(item.price * newCount)
        await updateCart(item._id, newCount)
    }

    return (
        <div className="cart-card">

            {/* Col 1 — Checkbox */}
            <div className="cart-card__checkbox form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onSelect(item._id, e.target.checked)}
                />
            </div>

            {/* Col 1 — Image */}
            <div className="cart-card__image-wrap">
                {item.product?.image ? (
                    <img src={item.product.image} alt={item.product?.name ?? "Product"} />
                ) : (
                    <div className="cart-card__image-placeholder">🛍️</div>
                )}
            </div>

            {/* Col 2 — Name + Variation */}
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
                <div className="cart-card__mobile-label">Unit price</div>
                <div className="cart-card__price-value">
                    ₱{item.price?.toLocaleString() ?? "0.00"}
                </div>
            </div>

            {/* Quantity */}
            <div className="cart-card__quantity">
                <div className="cart-card__mobile-label">Quantity</div>
                <div className="cart-card__qty-wrap">
                    <button
                        className="cart-card__qty-btn"
                        onClick={() => handleQuantityChange(count - 1)}
                        disabled={count <= 1}
                    >−</button>
                    <input
                        className="cart-card__qty-value"
                        type="text"
                        value={count}
                        readOnly
                    />
                    <button
                        className="cart-card__qty-btn cart-card__qty-btn--add"
                        onClick={() => handleQuantityChange(count + 1)}
                        disabled={isAtStockLimit}
                        title={isAtStockLimit ? `Only ${stock} in stock` : undefined}
                    >+</button>
                </div>
                <div className={`cart-card__stock-label${isAtStockLimit ? " cart-card__stock-label--warn" : ""}`}>
                    {isAtStockLimit ? `Max stock reached` : `${stock} left`}
                </div>
            </div>

            {/* Total Price */}
            <div className="cart-card__total">
                <div className="cart-card__mobile-label">Total</div>
                <div className="cart-card__total-value">
                    ₱{totalPrice.toLocaleString()}
                </div>
            </div>

            {/* Actions */}
            <div className="cart-card__actions">
                <button
                    className="cart-card__btn-delete"
                    onClick={() => {
                        if (!cart) 
                            {
                                console.log("Cant remove item in the cart")
                                return
                            }
                        handleRemoveCartItem(cart?._id, item?._id)
                    }}
                >Delete</button>
            </div>

        </div>
    );
};