import express from "express"
import { createGCashPaymentController, createGcashPaymentSourceController } from "../controllers/paymentController"

const router = express.Router()

router.post("/gcash/create-source", createGcashPaymentSourceController)
router.post("/gcash/webhook", createGCashPaymentController)

export default router