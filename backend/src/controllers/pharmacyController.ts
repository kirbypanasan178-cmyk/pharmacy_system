import { Request, Response } from "express";
import { createPharmacyService, deletePharmacyService, getAllPharmaciesService, getPharmacyByIdService, updatePharmacyService } from "../services/pharmacyService";

export const createPharmacyController = async (req: Request, res: Response) => {
    const data = req.body

    try {
        const pharmacy = await createPharmacyService(data)

        res.status(200).json(pharmacy)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getPharmacyByIdController = async (req: Request, res: Response) => {
    const pharmacyId = req.params.pharmacyId as string 

    try {
        const pharmacy = await getPharmacyByIdService(pharmacyId)

        if (!pharmacy) {
            res.status(404).json({ error: "Pharmacy not found" })
            return
        }

        res.status(200).json(pharmacy)
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const getAllPharmaciesController = async (req: Request, res: Response) => {
    try {
        const pharmacies = await getAllPharmaciesService()

        if (!pharmacies) {
            res.status(404).json({ error: "Pharmacies not found"})
        }
        res.status(200).json(pharmacies)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const updatePharmacyController = async (req: Request, res: Response) => {
    const pharmacyId = req.params.pharmacyId as string
    const data = req.body
    try {
        const pharmacy = await updatePharmacyService(pharmacyId, data)

        if (!pharmacy) {
            res.status(404).json({ error: "Pharmacy not found"})
        }

        res.status(200).json(pharmacy)
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}

export const deletePharmacyController = async (req: Request, res: Response) => {
    const pharmacyId = req.params.pharmacyId as string
    try {
        const pharmacy = await deletePharmacyService(pharmacyId)

         if (!pharmacy) {
            res.status(404).json({ error: "Pharmacy not found"})
        }

        res.status(200).json(pharmacy)

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message })
            return
        }
        res.status(500).json({ error: "Internal server error"})
    }
}