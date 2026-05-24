import mongoose from "mongoose";

const Schema = mongoose.Schema

const cartItemSchema = new Schema({
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
    
})

const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemSchema],
    shippingFee: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        default: 0
    },
}, { timestamps: true }
)

export const Cart = mongoose.model("Cart", cartSchema)
