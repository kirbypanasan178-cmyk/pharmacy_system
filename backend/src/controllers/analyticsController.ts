import { Request, Response } from "express"
import { getOrderStatusDistributionService, getOrderSummaryThisWeekService, getRevenueThisYearService, getTop10ProductsService, getTop3CategoriesService, getWeeklyRevenueService } from "../services/analyticsService"

export const getTop3CategoriesController = async (req: Request, res: Response) => {
    try {
        const data = await getTop3CategoriesService()

        if (!data) {
            res.status(404).json({ error: "Top 3 categories not found" })
            return
        }

        res.status(200).json(data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getOrderSummaryThisWeekController = async (req: Request, res: Response) => {
    try {
        const data = await getOrderSummaryThisWeekService()

        if (!data) {
            res.status(404).json({ error: "Order summary this week not found" })
            return
        }

        res.status(200).json(data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getTop10ProductsController = async (req: Request, res: Response) => {
    try {
        const data = await getTop10ProductsService()

        if (!data) {
            res.status(404).json({ error: "Top 10 products not found" })
            return
        }

        res.status(200).json(data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getWeeklyRevenueController = async (req: Request, res: Response) => {
    try {
        const data = await getWeeklyRevenueService()

        if (!data) {
            res.status(404).json({ error: "Weekly revenue not found" })
            return
        }
        
        res.status(200).json(data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: "Internal server error"})
    }
}
export const getRevenueThisYearController = async (req: Request, res: Response) => {
    try {
        const data = await getRevenueThisYearService()

        if (!data) {
            res.status(404).json({ error: "Revenue this year not found" })
            return
        }

        res.status(200).json(data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getOrderStatusDistributionController = async (req: Request, res: Response) => {
    try {
        const data = await getOrderStatusDistributionService()

        if (!data) {
            res.status(404).json({ error: "Order status distribution not found" })
            return
        }

        res.status(200).json(data)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
        }
        res.status(500).json({ error: "Internal server error"})
    }
}