import express from "express"
import { createCategoryController, deleteCategoryController, getALlCategoryController, updateCategoryController } from "../controllers/categoryController"
import { requireAuth } from "../middlewares/requireAuth"
import { isAdmin } from "../middlewares/isAdmin"

const router = express.Router()

router.use(requireAuth)

router.post("/", isAdmin, createCategoryController)
router.get("/", getALlCategoryController)
router.patch("/:id", isAdmin, updateCategoryController)
router.delete("/:id", isAdmin, deleteCategoryController)

export default router