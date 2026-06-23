import { Request, Response } from "express";
import { deleteUserService, getAllUsersService, getUserByIdService, updateUserService, blockUserService, unblockUserService } from "../services/userService";
import { Order } from "../models/orderModel";


export const getUserByIdController = async (req: Request, res: Response) => {
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

        const usersWithOrders = await Promise.all(
            users.map(async (user) => {
                const totalOrders = await Order.countDocuments({
                    userId: user._id
                })

                return {
                    ...user.toObject(),
                    totalOrders
                }
            })
        ) 

        res.status(200).json(usersWithOrders)

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

        const user = await deleteUserService(id);

        res.status(200).json(user);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
};

export const blockUserController = async (req: Request, res: Response) => {
    const id = req.params.id as string

    try {
        const user = await blockUserService(id)
        
        res.status(200).json(user)

    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
}

export const unblockUserController = async (req: Request, res: Response) => {
    const id = req.params.id as string

    try {
        const user = await unblockUserService(id)
        
        res.status(200).json(user)

    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
}