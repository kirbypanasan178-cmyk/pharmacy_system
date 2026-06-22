import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis";

// from frontend
const HEADER = "x-idempotency-key"
const TTL_SECONDS = 60 * 60 * 24

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.header(HEADER)

    if (!key) {
        return res.status(400).json({
            message: "Idempotency key header is required"
        })
    }
    // Create two redis key

    // marks that the request is being processed or already processed
    const lockKey = `idempotency:${key}`
    // stores the final response of the request
    const responseKey = `${lockKey}:response`

    try {
        const acquired = await redisClient.set(lockKey, "processing", "EX", TTL_SECONDS, "NX")

        // !acquired means the key already exist to redis
        if (!acquired) {
            // return the same response  if the key already exist
            const cached = await redisClient.get(responseKey)
            if (cached) {
                return res.status(200).json(JSON.parse(cached))
            }

            // return if its being processed
            return res.status(409).json({ message: "This request is already being processed"})
        }

        // stores the key to the request object so it can be use later in the controller
        (req as any).idempotencyKey = key
        next()
    } catch (error) {
        console.error("Idempotency middleware error: ", error)
        next()
    }

}