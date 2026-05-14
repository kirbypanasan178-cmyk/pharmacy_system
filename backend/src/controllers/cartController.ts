import { Request, Response } from "express";
import { createCartService, removeAllCartItemService, removeCartItemService, getCartByIdService, updateCartService } from "../services/cartService";

export const createCartController = async (req: Request, res: Response): Promise<void> => {
    const id = "69f5f36b8a32efadf3c2909a"
    
    const { items } = req.body
    try {

        const cart = await createCartService(id.toString(), items)

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
    const userId = "69f5f36b8a32efadf3c2909a"
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
    const { form } = req.body 
    try {
        const cart = await updateCartService(id.toString(), form)

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
    const userId = "69f5f36b8a32efadf3c2909a"

    try {
        const itemId = req.params.id as string
        
        const updatedCart = await removeCartItemService(userId, itemId)

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

export const removeAllCartItemController = async (req: Request, res: Response) => {
    const userId = "69f5f36b8a32efadf3c2909a"

    try {
        const updatedCart = await removeAllCartItemService(userId)

        res.status(200).json({ message: "Cart removed successfully" })
    } catch (error) {

    }
}

