import { Request, Response } from "express";
import { createGCashPaymentService, createGCashPaymentSourceService } from "../services/paymongoService";
import { Order } from "../models/orderModel";
import { Cart } from "../models/cartModel";
import { removeAllCartItemService, removeSelectedCartItemService } from "../services/cartService";
import { decreaseStockService } from "../services/productService";

// frontend redirects the user to checkout url 
export const createGcashPaymentSourceController = async (req: Request, res: Response) => {
    try {
        const { orderId, amount } = req.body
        const source = await createGCashPaymentSourceService(amount, orderId)

        res.json({
            checkoutUrl: source.attributes.redirect.checkout_url, 
            sourceId: source.id 
        })

    } catch (error: any) {
        res.status(500).json({ error: error.message || "Internal server error" });
    }
} 

// paymongo sends a webhook to the backend with the data object
export const createGCashPaymentController = async (req: Request, res: Response) => {
    try {
        const event = req.body.data

        if (event.attributes.type === "source.chargeable") {
            const source = event.attributes.data

            const sourceId = source.id

            console.log("Weebhook source object: ", JSON.stringify(source, null, 2))

            const orderId = new URL(source.attributes.redirect.success).searchParams.get("order_id")
            
            if (!orderId) {
                return res.status(400).json({ error: "Missing order_id" })
            }

            const order = await Order.findById(orderId)

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            if (order.paymentStatus === "paid") {
                return res.sendStatus(200);
            }

            if (source?.attributes?.status === "chargeable") {
                await createGCashPaymentService(
                    source.id, 
                    source.attributes.amount / 100, 
                    orderId
                )
                const updateOrder = await Order.findByIdAndUpdate(
                orderId,
                { 
                    paymentStatus: "paid", 
                    paidAt: new Date(), 
                    status: "pending" 
                    
                },
                { new: true }
                )

                console.log("G-cash orders: ", updateOrder)

                if (updateOrder) {
                    await decreaseStockService(updateOrder.items)
                    const cart = await Cart.findOne({ userId: updateOrder.userId })
                    if (cart) {

                        const orderedProductIds = new Set(
                            updateOrder.items.map((item) => item.product.toString())
                        )

                        const cartItemsIdsToRemove = cart.items
                        .filter((cartItem) => orderedProductIds.has(cartItem.product.toString()))
                        .map(cartItem => cartItem._id.toString())

                        await removeSelectedCartItemService(cart._id.toString(), cartItemsIdsToRemove)
                    }

                } 
            }
  
        }

        res.sendStatus(200)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}