import { Request, Response } from "express";
import { createCategoryService, deleteCategoryService, getAllCategoryService, updateCategoryService } from "../services/categoryService";

export const createCategoryController = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await createCategoryService(req.body)
        res.status(200).json(category)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message})
        }
        res.status(400).json({ error: "Internal server error"})
    }
}

export const getALlCategoryController = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await getAllCategoryService()
        res.status(200).json(category)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message})
        }
        res.status(400).json({ error: "Internal server error"})
    }
}

export const updateCategoryController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const category = await updateCategoryService(id, req.body)
        res.status(200).json(category)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message})
        }
        res.status(400).json({ error: "Internal server error"})
    }
}

export const deleteCategoryController = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const category = await deleteCategoryService(id)
        res.status(200).json(category)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message})
        }
        res.status(400).json({ error: "Internal server error"})
    }
}