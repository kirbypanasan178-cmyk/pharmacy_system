import express from "express"
import { 
    signupController, 
    loginController, 
    deleteUserController, 
    getAllUsersController, 
    getUserByIdController, 
    updateUserController, 
    blockUserController,
    unblockUserController
} from "../controllers/userController"
import  { signupValidation, loginValidation } from "../validators/userValidation"
import { requireAuth } from "../middlewares/requireAuth"

const router = express.Router()

// for users only
router.post("/signup", signupValidation, signupController)
// for users and admin
router.post("/login", loginValidation, loginController)
// for admins only
router.get("/users", getAllUsersController)
// for admins and users
router.get("/users/:id", getUserByIdController)
// for admins and users
router.patch("/users/:id", signupValidation, updateUserController)
// for admins only
router.delete("/users/:id", deleteUserController)

// for admin
router.patch("/block/:id", blockUserController)
router.patch("/unblock/:id", unblockUserController)



export default router