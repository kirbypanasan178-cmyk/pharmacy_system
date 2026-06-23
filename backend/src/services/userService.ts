import bcrypt from "bcrypt"
import User from "../models/userModel" 
import { generateSecureToken, getTokenExpiry } from "../utils/generateToken"
import { buildVerificationEmail, sendEmail } from "../utils/sendEmail"

export const getAllUsersService = async () => {
    const users = await User.find().select("-password")
    return users
}

export const getUserByIdService = async (id: string) => {
    const user = await User.findById(id).select("-password")

    if (!user) throw new Error("User not found")

    return user
}

export const updateUserService = async (
    id: string,
    data: Partial<{
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
   }> 
) => {

    if (data.password) {
        data.password = await bcrypt.hash(data.password, 12)
    }

    const user = await User.findByIdAndUpdate(
        id,
        { $set: data},
        { returnDocument: "after", runValidators: false}
    ).select("-password")

    if (!user) throw new Error("User not found")

    return user
}

export const deleteUserService = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) throw new Error("User not found");

  return { message: "User deleted successfully" };
};

export const blockUserService = async (id: string) => {
    const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { returnDocument: "after"}
    ).select("-password")

    if (!user) throw new Error("User not found")

    return user
}

export const unblockUserService = async (id: string) => {
    const user = await User.findByIdAndUpdate(
        id,
        { isActive: true },
        { returnDocument: "after"}
    ).select("-password")

    if (!user) throw new Error("User not found")

    return user
}
