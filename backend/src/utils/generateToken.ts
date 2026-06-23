import crypto from "crypto";

// generate a random string for the token from bytes to hex conversion
export const generateSecureToken = (bytes: number = 32): string => {
    return crypto.randomBytes(bytes).toString("hex")
}

export const getTokenExpiry = (hours: number = 24): Date => {
    return new Date(Date.now() + hours * 60 * 60 * 1000)
}