import express from "express"
import { createProductController, deleteProductController, getAllProductsController, getProductController, updateProductController } from "../controllers/productController"
import { productValidation } from "../validators/productValidation"
import { upload } from "../middlewares/upload"

const router = express.Router()

router.post("/", 
    (req, res, next) => {
        upload.single("image")(req, res, (err) => {
            if (err) {
                console.error("UPLOAD ERROR:", JSON.stringify(err, null, 2))
                console.error("UPLOAD ERROR MESSAGE:", err.message)
                return res.status(500).json({ error: err.message })
            }
            next()
        })
    },
    productValidation, 
    createProductController
)
router.get("/", getAllProductsController)
router.get("/:id", getProductController)
router.patch("/:id", productValidation, updateProductController)
router.delete("/:id", deleteProductController)

export default router