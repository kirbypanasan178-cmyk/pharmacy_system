import express from "express"
import { 
    deleteUserController, 
    getAllUsersController, 
    getUserByIdController, 
    updateUserController, 
    blockUserController,
    unblockUserController
} from "../controllers/userController"
import  { signupValidation, loginValidation } from "../validators/userValidation"
import { requireAuth } from "../middlewares/requireAuth"
import { isAdmin } from "../middlewares/isAdmin"
import { updateValidation } from "../validators/updateValidation"
import { loginLimiter, signupLimiter } from "../middlewares/rateLimiter"
import { loginController, resendVerificationEmailController, signupController, verifyEmailController } from "../controllers/authController"

const router = express.Router()

// for users only
router.post("/signup", signupValidation, signupLimiter, signupController)
router.get("/verify-email", verifyEmailController)
router.post("/resend-verification", resendVerificationEmailController)
// for users and admin
router.post("/login", loginValidation, loginLimiter, loginController)
// for admins only
router.get("/users", requireAuth, isAdmin, getAllUsersController)
// for admins and users
router.get("/users/:id", requireAuth, getUserByIdController)
// for admins and users
router.patch("/users/:id", requireAuth, updateValidation, updateUserController)
// for admins only
router.delete("/users/:id", requireAuth, isAdmin, deleteUserController)

// for admin
router.patch("/block/:id", requireAuth, isAdmin, blockUserController)
router.patch("/unblock/:id", requireAuth, isAdmin, unblockUserController)



export default router