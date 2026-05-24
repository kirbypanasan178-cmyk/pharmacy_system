import { Request, Response } from "express"
import { createOrderService, getAllOrderService, getOrderService, updateAdminOrderService, updateUserOrderService } from "../services/orderService"
import { PaymentStatus, Status } from "../types/order"

export const createOrderController = async (req: Request, res: Response) => {
    const  userId = "69f5f36b8a32efadf3c2909a"
    const {
        paymentMethod,
        shippingAddress,
    } = req.body

    try {
        const order = await createOrderService(
            userId,
            paymentMethod,
            shippingAddress
        )

        res.status(200).json(order)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

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
    const userId = "69f5f36b8a32efadf3c2909a"

    try {
        const order = await getOrderService(userId)

        if (!order) {
            res.status(404).json({ error: "Order not found"})
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

        const updateData: Partial<{
            status: Status,
            paymentStatus: PaymentStatus,
        }> = {}

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