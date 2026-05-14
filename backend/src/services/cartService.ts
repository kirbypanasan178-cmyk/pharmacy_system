import mongoose from "mongoose"
import { Cart } from "../models/cartModel"
import { CartForm, CartItemForm } from "../types/cart"

export const createCartService = async (userId: string, items: CartItemForm[]) => {
    try {

       if (!items || !Array.isArray(items)) {
            throw new Error("Items must be an array")
       }

       let cart = await Cart.findOne({ userId })

       

        if (!cart) {
             const totalPrice = items.reduce((sum, item) => {
                return sum + item.price * item.quantity
            }, 0)

            cart = await Cart.create({
                userId,
                items,
                totalPrice
            })
        } else {
            items.forEach((newItem) => {
                const existingItem = cart?.items.find(
                    (item) => newItem.product === item.product.toString()
                )

                if (existingItem) {
                    existingItem.quantity += newItem.quantity
                } else {
                    cart?.items.push(newItem)
                }
            })

             cart.totalPrice = cart?.items.reduce((sum, item) => {
                return sum + item.price * item.quantity
            }, 0)

            await cart.save()
        }
        await cart.populate("items.product")
        return cart
    } 

    
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to create cart")
    }
}

export const getCartByIdService = async (userId: string) => {
    try {
        const cart = await Cart.findOne({ userId }).populate("items.product")

        return cart
    } 
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get All Carts")
    }
}

export const updateCartService = async (id: string, form: CartForm) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            id,
            form,
            { returnDocument: "after"},
        )

        return cart
    } 
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update cart")
    }
}

export const removeCartItemService = async (userId: string, itemId: string) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            { $pull: { items: { _id: new mongoose.Types.ObjectId(itemId) } } },
            { returnDocument: "after" } // ✅ Add this — returns the updated cart
        ).populate("items.product")

        if (!updatedCart) throw new Error("Cart not found")

        return updatedCart
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update cart")
    }
}

export const removeAllCartItemService = async (userId: string) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            { userId },
            { 
                $set: {
                    items: []
                }
            },
            { returnDocument: "after" }
        )

        return updatedCart
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update cart")
    }
}

