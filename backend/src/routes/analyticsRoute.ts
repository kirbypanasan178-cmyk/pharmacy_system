import express from "express"
import { getOrderStatusDistributionController, getOrderSummaryThisWeekController, getRevenueThisYearController, getTop10ProductsController, getTop3CategoriesController, getWeeklyRevenueController } from "../controllers/analyticsController"
import { requireAuth } from "../middlewares/requireAuth"
import { isAdmin } from "../middlewares/isAdmin"

const router = express.Router()

router.use(requireAuth)
router.use(isAdmin)

router.get("/top-categories", getTop3CategoriesController)
router.get("/orders-this-week", getOrderSummaryThisWeekController)
router.get("/top-products", getTop10ProductsController)
router.get("/weekly-revenue", getWeeklyRevenueController)
router.get("/revenue-this-year", getRevenueThisYearController)
router.get("/order-status-distribution", getOrderStatusDistributionController)

export default router