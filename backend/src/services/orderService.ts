import { Cart } from "../models/cartModel"
import { Order } from "../models/orderModel"
import { AddressType, PaymentMethod, PaymentStatus, Status } from "../types/order"
 "../models/orderModel"

export const createOrderService = async (
    userId: string, 
    paymentMethod: PaymentMethod,
    shippingAddress: AddressType,
) => {
    try {
        const cart = await Cart.findOne({ userId })

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty")
        }

        const totalPrice = cart.totalPrice

        const shippingFee =  totalPrice <= 20000 ? 150 : 200 

        const order = Order.create({
            userId,
            items: cart.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            })),
            totalPrice,
            status: "pending",
            shippingFee,
            paymentMethod: paymentMethod,
            paymentStatus: "unpaid",
            shippingAddress: shippingAddress,
        })

        return order

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to create order")
    }
}

export const getOrderService = async (userId: string) => {
    try {
        const order = await Order.find({
            userId
        }).populate("items.product")

        return order
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get order")
    }
} 

export const getAllOrderService = async () => {
    try {
        const order = await Order.find()

        return order
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get all order")
    }
} 

export const updateAdminOrderService = async (
    orderId: string, 
    data: Partial<{
        status: Status,
        paymentStatus: PaymentStatus
    }>) => {
    try {   
        const timestampMap: Record<string, string> = {
            // status timestamps
            shipped:   "shippedAt",
            delivered: "deliveredAt",
            cancelled: "cancelledAt",
            // paymentStatus timestamps
            paid:      "paidAt",
            refunded:  "refundedAt",
        }

        const updateData: Record<string, any> = { ...data }

        if (data.status && timestampMap[data.status]) {
            updateData[timestampMap[data.status]] = new Date()
        }

        if (data.paymentStatus && timestampMap[data.paymentStatus]) {
            updateData[timestampMap[data.paymentStatus]] = new Date()
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: 
                updateData 
            },
            {
                returnDocument: "after"
            },
        )

        return order

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update order")
    }
}

export const updateUserOrderService = async (orderId: string, status: Status) => {
    try {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            {
                returnDocument: "after"
            }
        )

        return order
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update order")
    }
}

export const getOrdersTodayCountService = async () => {
    try {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const ordersToday = Order.countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        return ordersToday

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get orders today")
    }
}

export const getTotalSalesTodayService = async () => {
    try {
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const salesToday = await Order.find({
            paidAt: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            paymentStatus: "paid"
        })

        const totalSalesToday = salesToday.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        )

        return totalSalesToday

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get orders today")
    }
}