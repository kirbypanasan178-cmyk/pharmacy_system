import express from "express"
import { createCartController, removeCartItemController, getCarByIdController, updateCartController, removeAllCartItemController, removeSelectedCartItemController } from "../controllers/cartController"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()

router.use(requireAuth)

router.post("/", createCartController)
router.get("/:userId", getCarByIdController)
router.patch("/:id", updateCartController)
router.patch("/clear/:cartId", removeAllCartItemController)
router.patch("/selected-items/:cartId", removeSelectedCartItemController)
router.patch("/item/:cartId", removeCartItemController)

export default router