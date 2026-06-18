import { Request, Response } from "express"
import { createOrderService, getAllOrderService, getOrderService, getOrdersTodayCountService, getTotalSalesTodayService, updateAdminOrderService, updateUserOrderService } from "../services/orderService"
import { PaymentStatus, Status } from "../types/order"
import { createPayPalOrder, getPayPalAccessToken } from "../services/paypalService"
import { Order } from "../models/orderModel"

export const createOrderController = async (req: Request, res: Response) => {
    const userId = req.params.userId as string
    const { paymentMethod, shippingAddress } = req.body

    try {
        const order = await createOrderService(userId, paymentMethod, shippingAddress)

        if (paymentMethod === "paypal") {
            if (!order.totalPrice || isNaN(order.totalPrice)) {
    throw new Error("Invalid totalPrice for PayPal");
}

            const paypalOrder = await createPayPalOrder(order.totalPrice.toString())
            order.paypalOrderId = paypalOrder.id
            console.log("paypalOrder =", JSON.stringify(paypalOrder, null, 2));
            await order.save()

            const approveLink = paypalOrder.links?.find((l: any) => l.rel === "payer-action")

            if (!approveLink) {
                console.log("PayPal response:", order);
                throw new Error("PayPal approve link missing");
            }

            return res.status(200).json({
                order,
                paypalOrderId: paypalOrder.id,
                approveUrl: approveLink.href,
            })
        }

        res.status(200).json(order)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const capturePayPalOrderController = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  try {
    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getPayPalAccessToken()}`
        }
      }
    );

    const data = await response.json();

  if (!response.ok) {
  const isAlreadyCaptured = data?.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED";

  if (isAlreadyCaptured) {
    // Still mark the order as paid in case DB wasn't updated yet
    await Order.findOneAndUpdate(
      { paypalOrderId: orderId },
      { paymentStatus: "paid", paidAt: new Date(), status: "processing" },
      { returnDocument: "after" }
    );
    return res.json({ message: "Order already captured" });
  }

  console.error("PayPal capture error:", JSON.stringify(data, null, 2));
  return res.status(400).json({ error: data });
}


    return res.json(data);
  } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
};

export const getAllOrderController = async (req: Request, res: Response) => {
    try {
        const order = await getAllOrderService()

        if (!order) {
            res.status(404).json({ error: "Orders not found." })
            return
        }

        res.status(200).json(order)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getOrderController = async (req: Request, res: Response) => {
    const userId = req.params.userId as string

    try {
        const order = await getOrderService(userId)

        if (!order) {
            res.status(404).json({ error: "Order not found" })
            return
        }

        res.status(200).json(order)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateAdminOrderController = async (req: Request, res: Response) => {
    const orderId = req.params.id as string
    const { status, paymentStatus } = req.body

    try {
        const updateData: Partial<{ status: Status, paymentStatus: PaymentStatus }> = {}

        if (status) updateData.status = status
        if (paymentStatus) updateData.paymentStatus = paymentStatus

        const order = await updateAdminOrderService(orderId, updateData)

        if (!order) {
            res.status(404).json({ error: "Order not found" })
            return
        }

        res.status(200).json(order)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateUserOrderController = async (req: Request, res: Response) => {
    const orderId = req.params.id as string
    const { status } = req.body

    try {
        const order = await updateUserOrderService(orderId, status)

        if (!order) {
            res.status(404).json({ error: "Order not found" })
            return
        }

        res.status(200).json(order)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getOrdersTodayCountController = async (req: Request, res: Response) => {
    try {
        const ordersTodayCount = await getOrdersTodayCountService()

        res.status(200).json(ordersTodayCount)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getSalesTodayController = async (req: Request, res: Response) => {
    try {
        const salesToday = await getTotalSalesTodayService()

        res.status(200).json(salesToday)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}