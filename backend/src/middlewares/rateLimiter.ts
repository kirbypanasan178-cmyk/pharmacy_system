import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts, please try again after 15 minutes."
    }
})

export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many sign up attemtps, please try again after 1 hour."
    }
})

export const addToCartLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many request, slow down."
    }
})

export const searchProductLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: "Too many search attemtps, please try again after 1 minute."
    }
})


