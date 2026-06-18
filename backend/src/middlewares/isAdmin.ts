import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user) {
        res.status(401).json({ error: "Authentication required"})
        return
    }

    if (req.user.role !== "admin") {
        res.status(403).json({ error: "Admin access only" })
        return
    }

    next()
}