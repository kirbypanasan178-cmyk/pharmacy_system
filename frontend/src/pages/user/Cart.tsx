import { CartCard } from "../../components/cards/CartCard";
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import "../../css/Cart.css";
import { useEffect, useState } from "react";
import { useRemoveAllCartItem } from "../../hooks/cart/useRemoveAllCartItem";
import { OrderFormModal } from "../../components/modals/OrderFormModal";
import { useRemoveSelectedItem } from "../../hooks/cart/useRemoveSelectedCartItem";
import { useGetAllCart } from "../../hooks/cart/useGetAllCart";
import { useUser } from "../../hooks/useUser";

export const Cart = () => {
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { removeAllCartItem } = useRemoveAllCartItem();
  const { removeSelectedCartItem } = useRemoveSelectedItem();
  const { getAllCart } = useGetAllCart()

  const parsedUser = useUser()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const items = cart?.items ?? [];
  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const selectedItems = items.filter((item) => selectedIds.has(item._id));
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(items.map((item) => item._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleRemoveAllCart = async (cartId: string) => {
    if (allSelected) {
      await removeAllCartItem(cartId);
      return
    }
    await removeSelectedCartItem(cartId, [...selectedIds]);
  };

  useEffect(() => {
    getAllCart(parsedUser.user._id)
  }, [])

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="cart-loading__icon">
            <div className="cart-spinner" />
          </div>
          <p className="cart-loading__title">Loading your cart…</p>
          <p className="cart-loading__sub">Fetching your saved items</p>
          <div className="cart-skeleton-list">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="cart-skeleton-card">
                <div className="cart-skeleton__check" />
                <div className="cart-skeleton__img" />
                <div className="cart-skeleton__info">
                  <div className="cart-skeleton__line cart-skeleton__line--wide" />
                  <div className="cart-skeleton__line cart-skeleton__line--mid" />
                  <div className="cart-skeleton__line cart-skeleton__line--short" />
                </div>
                <div className="cart-skeleton__price" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-error">
          <div className="cart-error__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#ee4d2d"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                3.378c-.866-1.5-3.032-1.5-3.898 0L2.697
                16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="cart-error__title">Something went wrong</h3>
          <p className="cart-error__message">{error}</p>
          <button
            className="cart-error__retry"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Top Bar OUTSIDE .cart-page so it spans full width ── */}
      <div className="cart-topbar">
        <div className="cart-topbar__inner">
          <div className="cart-topbar__logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
            </svg>
          </div>
          <span className="cart-topbar__brand">PharmaCare</span>
          <span className="cart-topbar__sep">/</span>
          <span className="cart-topbar__title">Your Cart</span>
        </div>
      </div>

      <div className="cart-page">
        {/* ── Subbar (Count + Continue Shopping) ── */}
        {items.length > 0 && (
          <div className="cart-subbar">
            <span className="cart-subbar__count">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
            <a href="/home" className="cart-subbar__continue">
              Continue shopping
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}

        {/* ── Desktop Header Row ── */}
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

        {/* ── Cart Items ── */}
        <div className="cart-list">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty__icon">🛒</div>
              <h4 className="cart-empty__title">Your cart is empty</h4>
              <p className="cart-empty__sub">
                Add items from the store to get started.
              </p>
              <a href="/home" className="cart-empty__cta">
                Browse Products
              </a>
            </div>
          ) : (
            items.map((item) => (
              <CartCard
                key={item._id}
                item={item}
                checked={selectedIds.has(item._id)}
                onSelect={handleSelectOne}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer__left">
              <input
                type="checkbox"
                className="form-check-input"
                checked={allSelected}
                onChange={handleSelectAll}
              />
              <span>Select All ({items.length})</span>
              <button
                className="cart-footer__btn-delete"
                onClick={() => {
                  if (!cart) return;
                  handleRemoveAllCart(cart._id);
                }}
              >
                Delete
              </button>
            </div>
            <div className="cart-footer__right">
              <div className="cart-footer__total-wrap">
                <span className="cart-footer__total-label">
                  Total ({selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""}):
                </span>
                <span className="cart-footer__total-price">
                  ₱{selectedTotal.toLocaleString()}
                </span>
              </div>
              <button
                className="cart-footer__btn-checkout"
                disabled={selectedItems.length === 0}
                onClick={() => setIsModalOpen(true)}
              >
                Check Out ({selectedItems.length})
              </button>
            </div>
          </div>
        )}
      </div>

      <OrderFormModal
        items={selectedItems}
        selectedItemIds={selectedItems.map((item) => item._id)}
        shippingFee={cart?.shippingFee}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};