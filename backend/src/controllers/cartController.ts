import { Request, Response } from "express";
import { createCartService, removeAllCartItemService, removeCartItemService, getCartByIdService, updateCartService, removeSelectedCartItemService } from "../services/cartService";

export const createCartController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id.toString()
    
    const { items } = req.body
    try {

        if (!userId) {
            res.status(401).json({ error: "User can't be found" })
            return
        }

        const cart = await createCartService(userId, items)

        res.status(200).json(cart)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message})
            return
        }
        res.status(500).json({ error: "Internal server error" })
        return
    }
}

export const getCarByIdController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId as string
    
    try {
        const carts = await getCartByIdService(userId)

        res.status(200).json(carts)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({error: error.message})
            return
        }

        res.status(500).json({ error: "Internal server error"})
        return
    }
}

export const updateCartController = async (req: Request, res: Response) => {
    const id = req.params.id
    const { quantity } = req.body 

      if (!quantity) {
        return res.status(400).json({ error: "quantity is required" })
    }
    
    try {
        const cart = await updateCartService(id.toString(), quantity)

        res.status(200).json(cart)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
        return
    }
}

export const removeCartItemController = async (req: Request, res: Response) => {
    const cartId = req.params.cartId as string
    const { itemId } = req.body
    try {
        const updatedCart = await removeCartItemService(cartId, itemId)

        res.status(200).json({ message: "Cart item remove successfully" })
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
        return
    }
}

export const removeSelectedCartItemController = async (req: Request, res: Response) => {
    const cartId = req.params.cartId as string
    const { selectedItemIds } = req.body

    try {
        await removeSelectedCartItemService(cartId, selectedItemIds)

        res.status(200).json({ message: " Selected cart item remove successfully "})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
        return
    }
}

export const removeAllCartItemController = async (req: Request, res: Response) => {
    const cartId = req.params.cartId as string

    try {
        const updatedCart = await removeAllCartItemService(cartId)

        if (!updatedCart) {
            return res.status(404).json({
                message: "Cart not found"
            })
        }

        res.status(200).json(updatedCart)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
        return
    }
}

