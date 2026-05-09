import { NextFunction, Request, Response } from "express";
interface Params {
  id: string;
}

export const productValidation = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, category, stock } = req.body

    if (!name || !price || !category || !stock) {
        return res.status(400).json({ error: "All fields must be required" })
    }

    next()
}
