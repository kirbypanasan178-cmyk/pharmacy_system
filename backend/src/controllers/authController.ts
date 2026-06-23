import { Request, Response } from "express";
import { loginService, signupService } from "../services/authService";
import jwt from "jsonwebtoken";
import config from "../config/env";
import { resendVerificationEmailService, verifyEmailService } from "../services/verifyEmailService";
import { generateSecureToken, getTokenExpiry } from "../utils/generateToken";
import { Cart } from "../models/cartModel";


export const createToken = (_id: string): string => {
  return jwt.sign(
    { _id },
    config.JWT_SECRET as string,
    { expiresIn: "3d" }
  );
};

export const signupController = async (req: Request, res: Response) => {
  try {
    const result = await signupService(req.body)
    res.status(201).json({ success: true, ...result })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
export const verifyEmailController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.query as { token: string }
        const result = await verifyEmailService(token)
        
        res.status(200).json({ success: true, ...result })
    } catch (error: any) {
        const status = 
            error.message.includes("expired") ? 410 :
            error.message.includes("Invalid") ? 400 :
            error.message.includes("already verified") ? 409 : 500
        
        res.status(status).json({ success: false, message: error.message })
    }
}

export const resendVerificationEmailController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body
        if (!email) {
            res.status(400).json({ success: false, message: "Email is required" })
            return
        }
        const result = resendVerificationEmailService(email)
        
        res.status(200).json({ success: true, ...result })
    } catch (error: any) {
        const status = error.message.includes("wait") ? 429 :500
        res.status(status).json({ success: false, message: error.message})
    }
}

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const user = await loginService(email, password)

        if (!user.isVerified) {
            res.status(403).json({
                success: false,
                message: "Please verify you email before logging in.",
                code: "EMAIL_NOT_VERIFIED",
            })
            return
        }

        const cart = await Cart.findOne({ userId: user._id })
        
        if (!cart) {
            await Cart.create({
                userId: user._id,
                items: [],
            })
        }

        const token = createToken(user._id.toString())

        res.status(200).json({ 
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
            token })

    } catch (error: unknown) {
    if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
}
}
