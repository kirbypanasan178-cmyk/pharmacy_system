import express from "express"
import { createCartController, removeCartItemController, getCarByIdController, updateCartController, removeAllCartItemController } from "../controllers/cartController"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()

//router.use(requireAuth)

router.post("/", createCartController)
router.get("/", getCarByIdController)
router.delete("/", removeAllCartItemController)
router.patch("/:id", updateCartController)
router.delete("/:id", removeCartItemController)

export default router