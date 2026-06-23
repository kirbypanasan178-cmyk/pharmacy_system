import User from "../models/userModel"
import { generateSecureToken, getTokenExpiry } from "../utils/generateToken"
import { buildVerificationEmail, buildWelcomeEmail, sendEmail } from "../utils/sendEmail"

export const verifyEmailService = async (token: string) => {
    if (!token) throw new Error("Verification token is required.")

    // find user by token
    const user = await User.findOne({ verificationToken: token })

    if (!user) throw new Error("Invalid or already-used verification link.")

    // check expiry
    if (!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
        throw new Error("This verification link has expired. Please request a new one.")
    }

    // already verified guard
    if (user.isVerified) {
        throw new Error("This account is already verified. Please log in.")
    }

    // activate account + clear token
    user.isVerified = true
    user.verificationToken = null
    user.verificationTokenExpiry = null
    await user.save()

    sendEmail({
        to: user.email,
        subject: "Welcome to Pharmacare - Account Activated!",
        html: buildWelcomeEmail(user.fullname),
    }).catch(console.error)

    return { message: "Email verified successfully. Your account is now active." }

}

export const resendVerificationEmailService = async (email: string) => {
    const user = await User.findOne({ email })

    if (!user || user.isVerified) {
        return {
            message: "If that email is registered and unverified, a new link has been sent.",
        }
    }

    // Throttle: block resend if a valid token was issued less than 5 minutes ago
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    if (
        user.verificationTokenExpiry &&
        user.verificationTokenExpiry > fiveMinutesAgo
    ) {
        throw new Error("Please wait a few minutes before requesting another verification email.")
    }

    // Send new token
    user.verificationToken = generateSecureToken()
    user.verificationTokenExpiry = getTokenExpiry(24)
    await user.save()

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${user.verificationToken}`
    await sendEmail({
        to: user.email,
        subject: "Verify your Pharmacare account",
        html: buildVerificationEmail(user.fullname, verifyUrl)
    })

    return {
        message: "If that email is registered and unverified, a new link has been sent."
    }
}