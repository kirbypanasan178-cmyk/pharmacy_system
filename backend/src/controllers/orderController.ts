import { Request, Response } from "express";
import {
  cancelOrderService,
  createOrderService,
  getAllOrderService,
  getOrderByIdService,
  getOrdersTodayCountService,
  getTotalSalesTodayService,
  updateAdminOrderService,
  updateUserOrderService,
} from "../services/orderService";
import { PaymentStatus, Status } from "../types/order";
import {
  createPayPalOrder,
  getPayPalAccessToken,
} from "../services/paypalService";
import { Order } from "../models/orderModel";
import { redisClient } from "../config/redis";
import User from "../models/userModel";
import { removeSelectedCartItemService } from "../services/cartService";
import { Cart } from "../models/cartModel";
import { decreaseStockService } from "../services/productService";

const TTL_SECONDS = 60 * 60 * 24;

export const createOrderController = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { paymentMethod, shippingAddress, selectedCartItemIds } = req.body;
  const idempotencyKey = (req as any).idempotencyKey;

  try {
    const order = await createOrderService(
      userId,
      paymentMethod,
      shippingAddress,
      selectedCartItemIds,
    );

    if (paymentMethod === "paypal") {
      if (!order.totalPrice || isNaN(order.totalPrice)) {
        throw new Error("Invalid totalPrice for PayPal");
      }

      const paypalOrder = await createPayPalOrder(order.totalPrice.toString());
      order.paypalOrderId = paypalOrder.id;
      await order.save();

      const approveLink = paypalOrder.links?.find(
        (l: any) => l.rel === "payer-action",
      );

      if (!approveLink) {
        console.log("PayPal response:", order);
        throw new Error("PayPal approve link missing");
      }

      const responsePayload = {
        order,
        paypalOrderId: paypalOrder.id,
        approveUrl: approveLink.href,
      };

      if (idempotencyKey) {
        await redisClient.set(
          `idempotency:${idempotencyKey}:response`,
          JSON.stringify(responsePayload),
          "EX",
          TTL_SECONDS,
        );
      }

      return res.status(200).json(responsePayload);
    }

    if (idempotencyKey) {
      await redisClient.set(
        `idempotency:${idempotencyKey}:response`,
        JSON.stringify(order),
        "EX",
        TTL_SECONDS,
      );
    }

    await decreaseStockService(order.items)

    const cart = await Cart.findOne({ userId });

    if (cart) {
      await removeSelectedCartItemService(
        cart._id.toString(),
        selectedCartItemIds,
      );
    }

    res.status(200).json({ order });
  } catch (error: unknown) {
    if (idempotencyKey) {
      await redisClient.del(`idempotency:${idempotencyKey}`);
    }

    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const capturePayPalOrderController = async (
  req: Request,
  res: Response,
) => {
  const { orderId } = req.body;

  try {
    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getPayPalAccessToken()}`,
        },
      },
    );

    const data = await response.json();

    console.log("Paypal response: ", data);

    if (!response.ok) {
      const isAlreadyCaptured =
        data?.details?.[0]?.issue === "ORDER_ALREADY_CAPTURED";

      if (isAlreadyCaptured) {
        // Still mark the order as paid in case DB wasn't updated yet
        await Order.findOneAndUpdate(
          { paypalOrderId: orderId },
          { paymentStatus: "paid", paidAt: new Date(), status: "pending" },
          { returnDocument: "after" },
        );
        return res.json({ message: "Order already captured" });
      }

      return res.status(400).json({ error: data });
    }

    const updateOrder = await Order.findOneAndUpdate(
      { paypalOrderId: orderId },
      { paymentStatus: "paid", paidAt: new Date(), status: "pending" },
      { new: true },
    );

    if (!updateOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    await decreaseStockService(updateOrder.items);

    const cart = await Cart.findOne({ userId: updateOrder.userId });
    if (cart) {
      const orderedProductIds = new Set(
        updateOrder.items.map((item) => item.product.toString()), // or item.productId
      );
      const cartItemIdsToRemove = cart.items
        .filter((cartItem) =>
          orderedProductIds.has(cartItem.product.toString()),
        )
        .map((cartItem) => cartItem._id.toString());

      await removeSelectedCartItemService(
        cart._id.toString(),
        cartItemIdsToRemove,
      );
    }

    return res.json({ data, order: updateOrder });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrderController = async (req: Request, res: Response) => {
  try {
    const order = await getAllOrderService();

    if (!order) {
      res.status(404).json({ error: "Orders not found." });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;

  try {
    const order = await getOrderByIdService(userId);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAdminOrderController = async (
  req: Request,
  res: Response,
) => {
  const orderId = req.params.id as string;
  const { status, paymentStatus } = req.body;

  try {
    const updateData: Partial<{
      status: Status;
      paymentStatus: PaymentStatus;
    }> = {};

    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await updateAdminOrderService(orderId, updateData);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserOrderController = async (
  req: Request,
  res: Response,
) => {
  const orderId = req.params.id as string;
  const { status } = req.body;

  try {
    const order = await updateUserOrderService(orderId, status);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrdersTodayCountController = async (
  req: Request,
  res: Response,
) => {
  try {
    const ordersTodayCount = await getOrdersTodayCountService();

    res.status(200).json(ordersTodayCount);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSalesTodayController = async (req: Request, res: Response) => {
  try {
    const salesToday = await getTotalSalesTodayService();

    res.status(200).json(salesToday);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params

    const updateOrder = await cancelOrderService(orderId as string)

    res.status(200).json({ 
      message: "Order cancelled successfully",
      order: updateOrder,
    })

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
}