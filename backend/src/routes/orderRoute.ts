import express from "express"
import { cancelOrderController, capturePayPalOrderController, createOrderController, getAllOrderController, getOrderByIdController, getOrdersTodayCountController, getSalesTodayController, updateAdminOrderController, updateUserOrderController } from "../controllers/orderController"
import { requireAuth } from "../middlewares/requireAuth"
import { isAdmin } from "../middlewares/isAdmin"
import { idempotencyMiddleware } from "../middlewares/idempotency"


const router = express.Router()

router.use(requireAuth)

router.post("/:userId", idempotencyMiddleware, createOrderController)
router.post("/paypal/capture", capturePayPalOrderController)
router.get("/", isAdmin, getAllOrderController)
router.get("/:userId", getOrderByIdController)
router.get("/today/count", isAdmin, getOrdersTodayCountController)
router.get("/today/sales", isAdmin, getSalesTodayController)
router.patch("/admin/:id", isAdmin, updateAdminOrderController)
router.patch("/user/:id", updateUserOrderController)
router.patch("/admin/cancel-order/:orderId", isAdmin, cancelOrderController)

export default router