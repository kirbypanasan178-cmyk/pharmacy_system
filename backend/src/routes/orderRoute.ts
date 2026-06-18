import express from "express"
import { capturePayPalOrderController, createOrderController, getAllOrderController, getOrderController, getOrdersTodayCountController, getSalesTodayController, updateAdminOrderController, updateUserOrderController } from "../controllers/orderController"
import { requireAuth } from "../middlewares/requireAuth"
import { isAdmin } from "../middlewares/isAdmin"


const router = express.Router()

router.use(requireAuth)

router.post("/:userId", createOrderController)
router.post("/paypal/capture", capturePayPalOrderController)
router.get("/", isAdmin, getAllOrderController)
router.get("/:userId", getOrderController)
router.get("/today/count", isAdmin, getOrdersTodayCountController)
router.get("/today/sales", isAdmin, getSalesTodayController)
router.patch("/admin/:id", isAdmin, updateAdminOrderController)
router.patch("/user/:id", updateUserOrderController)

export default router