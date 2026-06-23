import bcrypt from "bcrypt"
import User from "../models/userModel" 
import { generateSecureToken, getTokenExpiry } from "../utils/generateToken"
import { buildVerificationEmail, sendEmail } from "../utils/sendEmail"

export const comparePassword = async (
    password: string, hashedPassword: string): Promise<boolean> => {
        return await bcrypt.compare(password, hashedPassword)
}

export const signupService = async (data: {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: {
        street: string;
        barangay: string;
        city: string;
        province: string;
        zipcode: string;
    }
    gender: "male" | "female" | "other";
    age: number;
    birthdate: Date;
    birthplace: string;
}) => {
    // check for existing account
    const existing = await User.findOne({ email: data.email })
    if (existing) throw new Error("Email already in use")
    
    // generate verification token
    const verificationToken = generateSecureToken()
    const verificationTokenExpiry = getTokenExpiry(24)

    // Create user (isVerified = false by default)    
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await User.create({
        ...data,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiry,
    })

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
    await sendEmail({
        to: data.email,
        subject: "Verify your Pharmacare account",
        html: buildVerificationEmail(data.fullname, verifyUrl)
    })
    

    return {
        message: "Registration successful. Please check your email  to verify your account.",
        userId: user._id
    }

}

export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error("Invalid email or password")

    const match = await comparePassword(password, user.password)

    if (!match) throw new Error("Invalid email or password")

        if (!user.isVerified) {
  throw new Error("Please verify your email before logging in.")
}

    const { password: _, ...safeUser } = user.toObject()

    return safeUser
}
