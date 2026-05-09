import { Request, Response } from "express"
import { createProductService, deleteProductService, getAllProductsService, getProductService, updateProductService } from "../services/productService"

interface Params {
    id: string;
}


export const createProductController = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("req.file:", req.file)
        console.log("req.body:", req.body)
        
        const productData = {
            ...req.body,
            image: req.file?.path
        }

        const product = await createProductService(productData)
        res.status(200).json(product)
    } catch (error: unknown) {
        console.error("FULL ERROR:", error) // 👈 add this
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}
export const getProductController = async (req: Request<Params>, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const product = await getProductService(id)

        if (!product) {
            res.status(401).json({ error: "Product not found" })
            return
        }
        res.status(200).json(product)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getAllProductsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await getAllProductsService()
        res.status(200).json(product)
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error" })
    }
}

export const updateProductController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const product = await updateProductService(id, req.body)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteProductController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params

  try {
    const product = await deleteProductService(id)
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}