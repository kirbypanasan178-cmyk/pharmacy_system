import User from "../models/userModel";
import { Request, Response } from "express";
import { signupService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService, loginService } from "../services/userService";
import jwt from "jsonwebtoken";
import config from "../config/env";

export const createToken = (_id: string): string => {
  return jwt.sign(
    { _id },
    config.JWT_SECRET as string,
    { expiresIn: "3d" }
  );
};

export const signupController = async (req: Request, res: Response) => {
    try {
        const user = await signupService(req.body)

        const { password, ...safeUser } = (user as any).toObject()

        res.status(200).json(safeUser)

    } catch (error: any) {
        res.status(400).json({ error: error.message})
    }
}

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const user = await loginService(email, password)
        const token = createToken(user._id.toString())

        res.status(200).json({ user, token })

    } catch (error: unknown) {
    if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
}
}

export const getUserController = async (req: Request, res: Response) => {
    const id = req.params.id

    try {

        if (Array.isArray(id)) {
            throw new Error("Invalid id")
        }

        const user = await getUserByIdService(id)

        res.status(200).json(user)

    } catch (error: any) {
        res.status(400).json({ error: error.message})
    }
}

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsersService()

        res.status(200).json(users)

    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
}

export const updateUserController = async (req: Request, res: Response) => {
    const id = req.params.id
    try {

        if (Array.isArray(id)) {
            throw new Error("Invalid id")
        }

        const user = await updateUserService(id, req.body)

        res.status(200).json(user)
    } catch (error: any) {
         res.status(400).json({ error: error.message });
    }
}

export const deleteUserController = async (req: Request, res: Response) => {

    const id  = req.params.id

    try {

        if (Array.isArray(id)) {
            throw new Error("Invalid id")
        }

        const result = await deleteUserService(id);

        res.status(200).json(result);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};