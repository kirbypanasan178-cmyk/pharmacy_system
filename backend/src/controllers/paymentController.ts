import { Request, Response } from "express";
import { createGCashPaymentService, createGCashPaymentSourceService } from "../services/paymongoService";
import { Order } from "../models/orderModel";

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
                await Order.findByIdAndUpdate(
                orderId,
                { paymentStatus: "paid", paidAt: new Date(), status: "pending" },
                { new: true }
                )
            }
  
        }

        res.sendStatus(200)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}