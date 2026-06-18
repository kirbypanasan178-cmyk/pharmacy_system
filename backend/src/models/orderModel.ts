import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const shippingAddressSchema = new Schema({
  fullname: { type: String, required: true },
  street:   { type: String, required: true },
  city:     { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone:    { type: String, required: true },
});

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "gcash", "card", "paypal"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    
    paypalOrderId: {
      type: String,
      default: null,
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    shippedAt:    { type: Date, default: null },
    deliveredAt:  { type: Date, default: null },
    cancelledAt:  { type: Date, default: null },
    paidAt:       { type: Date, default: null },
    refundedAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);