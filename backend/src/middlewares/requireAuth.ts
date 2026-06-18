import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import config from "../config/env";

interface CustomJwtPayload extends JwtPayload {
    _id: string;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization is required" });
    }

    if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid authorization format" });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as CustomJwtPayload;

        const user = await User.findById(decoded._id).select("_id role");

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Token expired" });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid token" });
        }

        return res.status(500).json({ error: "Authentication failed" });
    }
};