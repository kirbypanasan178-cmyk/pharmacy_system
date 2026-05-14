import express from "express"
import { createCategoryController, deleteCategoryController, getALlCategoryController, updateCategoryController } from "../controllers/categoryController"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()



router.post("/", createCategoryController)
router.get("/", getALlCategoryController)
router.patch("/:id", updateCategoryController)
router.delete("/:id", deleteCategoryController)

export default router