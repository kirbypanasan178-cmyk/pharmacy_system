import React, { useState } from "react";
import { orderValidation, type ValidationErrorsOrder } from "../../validators/orderValidation";
import { useCreateOrder } from "../../hooks/order/useCreateOrder";
import { addressInitialForm, type AddressFormType } from "../../types/order";
import type { CartItem } from "../../features/cartSlice";
import "../../css/OrderModal.css"
import { useAppSelector } from "../../hooks/redux/reduxHooks";
import { useRemoveSelectedItem } from "../../hooks/cart/useRemoveSelectedCartItem";

type PaymentMethod = "cod" | "gcash" | "card" | "paypal";

interface OrderModalProps {
  items: CartItem[];
  selectedItemIds: string[]
  shippingFee?: number;
  isOpen: boolean
  onClose: () => void;
}


const paymentOptions: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  {
    value: "cod",
    label: "Cash on delivery",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M6 12h.01M18 12h.01"/>
      </svg>
    ),
  },
  {
    value: "gcash",
    label: "GCash",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2"/>
        <line x1="11" y1="18" x2="13" y2="18"/>
      </svg>
    ),
  },
  {
    value: "card",
    label: "Card",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
  {
    value: "paypal",
    label: "PayPal",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 11C7 11 6 17 10 17H14C17 17 19 15 19 12C19 9 17 7 14 7H9C8 7 7 8 7 9V11Z"/>
        <path d="M5 15C5 15 4 21 8 21H12C15 21 17 19 17 16"/>
      </svg>
    ),
  },
];

export const OrderFormModal: React.FC<OrderModalProps> = ({
  items,
  selectedItemIds,
  shippingFee = 0,
  isOpen,
  onClose,
}) => {
  const { createOrder } = useCreateOrder();
  const { removeSelectedCartItem } = useRemoveSelectedItem();
  const cart = useAppSelector((state) => state.cart.cart);

  const [form, setForm] = useState<AddressFormType>(addressInitialForm);
  const [selectPayment, setSelectPayment] = useState<PaymentMethod>("cod");
  const [errors, setErrors] = useState<ValidationErrorsOrder>({});

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

  const handleReset = () => { setForm(addressInitialForm); setErrors({}); };

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    const newErrors = orderValidation(form);
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    if (!cart) return;
    console.log("Cart items today: ", cart)
    try {
      const { approveUrl } = await createOrder(form, selectPayment);
      if (approveUrl) { window.location.href = approveUrl; return; }
      await removeSelectedCartItem(cart._id, selectedItemIds);
      onClose();
      handleReset();
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
    >
      <div
        className="d-flex flex-column bg-white overflow-hidden w-100"
        style={{ maxWidth: 460, maxHeight: "90vh", borderRadius: 16, border: "0.5px solid #9FE1CB" }}
      >

        {/* Header */}
        <div
          className="d-flex align-items-start justify-content-between px-4 pt-4 pb-3"
          style={{ background: "#E1F5EE", borderBottom: "0.5px solid #9FE1CB" }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0 text-white"
              style={{ width: 36, height: 36, borderRadius: 10, background: "#1D9E75", fontSize: 18 }}
            >
              {/* Shopping cart SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <div>
              <p className="mb-0 fw-medium" style={{ fontSize: 15, color: "#085041" }}>Place order</p>
              <p className="mb-0" style={{ fontSize: 12, color: "#0F6E56" }}>Review and confirm your order details</p>
            </div>
          </div>
          <button
            className="d-flex align-items-center justify-content-center ms-3 flex-shrink-0"
            onClick={() => { onClose(); handleReset(); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(29,158,117,0.1)",
              color: "#0F6E56",
              cursor: "pointer",
              border: "1px solid rgba(15, 110, 86, 0.25)",
            }}
          >
            {/* Close X SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-grow-1 px-4 py-4 d-flex flex-column gap-4">

          {/* Order items */}
          <section>
            <p className="section-label text-uppercase text-muted mb-2">Order items</p>
            <div style={{ border: "0.5px solid #9FE1CB", borderRadius: 12, overflow: "hidden", background: "#f9fdfb" }}>
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  className="d-flex align-items-center justify-content-between px-3 py-2"
                  style={idx < items.length - 1 ? { borderBottom: "0.5px solid #9FE1CB" } : {}}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 32, height: 32, borderRadius: 8, background: "#E1F5EE", color: "#1D9E75", fontSize: 15 }}
                    >
                      {/* Package SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16.5 9.4 7.55 4.24"/>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.29 7 12 12 20.71 7"/>
                        <line x1="12" y1="22" x2="12" y2="12"/>
                      </svg>
                    </div>
                    <div>
                      <p className="mb-0 fw-medium" style={{ fontSize: 13 }}>{item.product.name}</p>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                  </div>
                  <span className="fw-medium" style={{ fontSize: 13, color: "#085041" }}>
                    ₱{(item.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping address */}
          <section>
            <p className="section-label text-uppercase text-muted mb-2">Shipping address</p>
            <div className="row g-2">
              <div className="col-12">
                <label className="form-label" style={{ fontSize: 12 }}>Full name</label>
                <input
                  name="fullname"
                  className={`form-control form-control-sm ${errors.fullname ? "is-invalid" : ""}`}
                  placeholder="Juan dela Cruz"
                  value={form.fullname}
                  onChange={handleChange}
                />
                {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
              </div>
              <div className="col-6">
                <label className="form-label" style={{ fontSize: 12 }}>Phone</label>
                <input
                  name="phone"
                  className={`form-control form-control-sm ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="09XX XXX XXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
              <div className="col-6">
                <label className="form-label" style={{ fontSize: 12 }}>Postal code</label>
                <input
                  name="postalCode"
                  className={`form-control form-control-sm ${errors.postalCode ? "is-invalid" : ""}`}
                  placeholder="1100"
                  value={form.postalCode}
                  onChange={handleChange}
                />
                {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
              </div>
              <div className="col-12">
                <label className="form-label" style={{ fontSize: 12 }}>Street address</label>
                <input
                  name="street"
                  className={`form-control form-control-sm ${errors.street ? "is-invalid" : ""}`}
                  placeholder="123 Rizal St., Brgy. San Juan"
                  value={form.street}
                  onChange={handleChange}
                />
                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
              </div>
              <div className="col-6">
                <label className="form-label" style={{ fontSize: 12 }}>City</label>
                <input
                  name="city"
                  className={`form-control form-control-sm ${errors.city ? "is-invalid" : ""}`}
                  placeholder="Quezon City"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>
              <div className="col-6">
                <label className="form-label" style={{ fontSize: 12 }}>Province</label>
                <input
                  name="province"
                  className={`form-control form-control-sm ${errors.province ? "is-invalid" : ""}`}
                  placeholder="Metro Manila"
                  value={form.province}
                  onChange={handleChange}
                />
                {errors.province && <div className="invalid-feedback">{errors.province}</div>}
              </div>
            </div>
          </section>

          {/* Payment method */}
          <section>
            <p className="section-label text-uppercase text-muted mb-2">Payment method</p>
            <div className="row g-2">
              {paymentOptions.map((opt) => (
                <div className="col-3" key={opt.value}>
                  <button
                    type="button"
                    onClick={() => setSelectPayment(opt.value)}
                    className={`payment-btn ${selectPayment === opt.value ? "active" : ""}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary */}
          <section className="border-top pt-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted">Subtotal</small>
              <small>₱{subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</small>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <small className="text-muted">Shipping fee</small>
              <small>₱{shippingFee.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</small>
            </div>
            <div className="d-flex justify-content-between align-items-center total-pill mt-1">
              <span className="fw-medium" style={{ fontSize: 14, color: "#085041" }}>Total</span>
              <span className="fw-medium" style={{ fontSize: 16, color: "#085041" }}>
                ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div
          className="d-flex gap-2 px-4 py-3"
          style={{ borderTop: "0.5px solid #9FE1CB", background: "#f9fdfb" }}
        >
          <button
            className="btn flex-grow-1"
            style={{ border: "0.5px solid #9FE1CB", color: "#0F6E56", background: "#fff", fontSize: 13 }}
            onClick={() => { onClose(); handleReset(); }}
          >
            Cancel
          </button>
          <button
            className="btn d-flex align-items-center justify-content-center gap-2"
            style={{ flex: 2, background: "#1D9E75", color: "#fff", fontSize: 13, border: "none" }}
            onClick={handleConfirm}
          >
            {/* Cart check SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              <polyline points="9 11 11 13 15 9"/>
            </svg>
            Confirm order
          </button>
        </div>

      </div>
    </div>
  );
};