import express from "express"
import { 
    signupController, 
    loginController, 
    deleteUserController, 
    getAllUsersController, 
    getUserController, 
    updateUserController 
} from "../controllers/userController"
import  { signupValidation, loginValidation } from "../validators/userValidation"

const router = express.Router()

router.post("/signup", signupValidation, signupController)
router.post("/login", loginValidation, loginController)
router.get("/", getAllUsersController)
router.get("/:id", getUserController)
router.patch("/:id", signupValidation, updateUserController)
router.delete("/:id", deleteUserController)


export default router