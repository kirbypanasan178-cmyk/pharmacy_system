import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { orderValidation, type ValidationErrorsOrder } from "../../validators/orderValidation";
import { useCreateOrder } from "../../hooks/order/useCreateOrder";
import { addressInitialForm, type AddressFormType } from "../../types/order";
import type { CartItem } from "../../features/cartSlice";
import "../../css/OrderModal.css"
import { useRemoveAllCartItem } from "../../hooks/cart/useRemoveAllCartItem";
import { useAppSelector } from "../../hooks/redux/reduxHooks";

type PaymentMethod = "cod" | "gcash" | "card";

interface OrderModalProps {
  items: CartItem[];
  shippingFee?: number;
  isOpen: boolean
  onClose: () => void;
}

const paymentOptions: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: "cod",   label: "Cash on delivery", icon: "ti-cash" },
  { value: "gcash", label: "GCash",             icon: "ti-device-mobile" },
  { value: "card",  label: "Card",              icon: "ti-credit-card" },
];

export const OrderModal: React.FC<OrderModalProps> = ({
  items,
  shippingFee = 0,
  isOpen,
  onClose,
}) => {

    const { createOrder } = useCreateOrder()
    const { removeAllCartItem } = useRemoveAllCartItem()

    const cart = useAppSelector((state) => state.cart.cart)

  const [form, setForm] = useState<AddressFormType>(addressInitialForm);
  const [selectPayment, setSelectPayment] = useState<PaymentMethod>("cod")
  const [errors, setErrors] = useState<ValidationErrorsOrder>({});

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + shippingFee;

    const handleReset = () => {
        setForm(addressInitialForm)
        setErrors({})
    }

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault()

    const newErrors = orderValidation(form)

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
    }

    if (!cart) return


    console.log("Payment method being sent:", selectPayment) // 👈 add this
    
    await createOrder(form, selectPayment)
    await removeAllCartItem(cart?._id)

    onClose()
    handleReset()
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
        ...prev,
        [name]: value
    })
    )
  }

  if (!isOpen) return null

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-medium mb-0">Place order</h5>
              <small className="text-muted">Review and confirm your order details</small>
            </div>
            <button className="btn-close" 
            onClick={() => { onClose(); handleReset()}}
            />
          </div>

          <div className="modal-body d-flex flex-column gap-4">

            {/* Items */}
            <section>
              <p className="text-muted small fw-medium text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>
                Order items
              </p>
              <div className="border rounded">
                {items.map((item, idx) => (
                  <div
                    key={item._id}
                    className={`d-flex align-items-center justify-content-between px-3 py-2 ${idx < items.length - 1 ? "border-bottom" : ""}`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-secondary-subtle rounded d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                        <i className="ti ti-package text-muted" />
                      </div>
                      <div>
                        <p className="mb-0 fw-medium" style={{ fontSize: 14 }}>{item.product.name}</p>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-medium" style={{ fontSize: 14 }}>
                      ₱{(item.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <p className="text-muted small fw-medium text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>
                Shipping address
              </p>
              <div className="row g-3">
                <div className="col-12">
                  <Input
                    name="fullname"
                    label="Full name"
                    placeholder="Juan dela Cruz"
                    value={form.fullname}
                    onChange={handleChange}
                    error={errors.fullname}
                    variant={errors.fullname ? "error" : "default"}
                  />
                </div>
                <div className="col-6">
                  <Input
                    name="phone"
                    label="Phone"
                    placeholder="09XX XXX XXXX"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    variant={errors.phone ? "error" : "default"}
                  />
                </div>
                <div className="col-6">
                  <Input
                    name="postalCode"
                    label="Postal code"
                    placeholder="1100"
                    value={form.postalCode}
                    onChange={handleChange}
                    error={errors.postalCode}
                    variant={errors.postalCode ? "error" : "default"}
                  />
                </div>
                <div className="col-12">
                  <Input
                    name="street"
                    label="Street address"
                    placeholder="123 Rizal St., Brgy. San Juan"
                    value={form.street}
                    onChange={handleChange}
                    error={errors.street}
                    variant={errors.street ? "error" : "default"}
                  />
                </div>
                <div className="col-6">
                  <Input
                    name="city"
                    label="City"
                    placeholder="Quezon City"
                    value={form.city}
                    onChange={handleChange}
                    error={errors.city}
                    variant={errors.city ? "error" : "default"}
                  />
                </div>
                <div className="col-6">
                  <Input
                    name="province"
                    label="Province"
                    placeholder="Metro Manila"
                    value={form.province}
                    onChange={handleChange}
                    error={errors.province}
                    variant={errors.province ? "error" : "default"}
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <Label className="text-muted small text-uppercase mb-2" style={{ letterSpacing: "0.05em" }}>
                Payment method
              </Label>
              <div className="row g-2">
                {paymentOptions.map(opt => (
                  <div className="col-4" key={opt.value}>
                    <button
                      type="button"
                      onClick={() => setSelectPayment(opt.value)}
                      className={`w-100 d-flex flex-column align-items-center gap-1 py-2 rounded ${
                        selectPayment === opt.value
                          ? "border border-primary bg-primary-subtle text-primary"
                          : "border bg-secondary-subtle text-muted"
                      }`}
                      style={{ fontSize: 12, fontWeight: 500, transition: "all .15s" }}
                    >
                      <i className={`ti ${opt.icon}`} style={{ fontSize: 20 }} />
                      {opt.label}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Order Summary */}
            <section className="border-top pt-3">
              <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Subtotal</small>
                <small>₱{subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</small>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">Shipping fee</small>
                <small>₱{shippingFee.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</small>
              </div>
              <div className="d-flex justify-content-between fw-medium">
                <span>Total</span>
                <span>₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={() => { onClose(); handleReset()}}>Cancel</button>
            <button className="btn btn-dark d-flex align-items-center gap-2" 
            onClick={(e) => {
                handleConfirm(e)
            }}
            
            >
              <i className="ti ti-shopping-cart-check" />
              Confirm order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};