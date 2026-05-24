import express from "express"
import { createCartController, removeCartItemController, getCarByIdController, updateCartController, removeAllCartItemController } from "../controllers/cartController"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()

//router.use(requireAuth)

router.post("/", createCartController)
router.get("/", getCarByIdController)
router.patch("/:id", updateCartController)
router.patch("/clear/:itemId", removeAllCartItemController)
router.patch("/item/:cartId", removeCartItemController)

export default router