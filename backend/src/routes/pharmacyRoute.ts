import express from "express"
import { createPharmacyController, deletePharmacyController, getAllPharmaciesController, getPharmacyByIdController, updatePharmacyController } from "../controllers/pharmacyController"
import { isAdmin } from "../middlewares/isAdmin"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()

router.use(requireAuth)
router.use(isAdmin)

router.post("/", createPharmacyController)
router.get("/", getAllPharmaciesController)
router.get("/:pharmacyId", getPharmacyByIdController)
router.patch("/:id", updatePharmacyController)
router.delete("/:pharmacyId", deletePharmacyController)

export default router