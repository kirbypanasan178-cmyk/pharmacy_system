import mongoose from "mongoose";

const Schema = mongoose.Schema

const cartItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        requred: true,
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0
    },
}, { timestamps: true }
)

export const Cart = mongoose.model("Cart", cartSchema)
