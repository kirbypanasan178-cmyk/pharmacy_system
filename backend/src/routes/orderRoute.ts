import express from "express"
import { createOrderController, getAllOrderController, getOrderController, updateAdminOrderController, updateUserOrderController } from "../controllers/orderController"

const router = express.Router()

router.post("/", createOrderController)
router.get("/", getAllOrderController)
router.get("/:id", getOrderController)
router.patch("/:id", updateAdminOrderController)
router.patch("/:id", updateUserOrderController)

export default router