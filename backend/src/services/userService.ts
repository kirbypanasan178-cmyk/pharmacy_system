import bcrypt from "bcrypt"
import User from "../models/userModel" 

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
    const existing = await User.findOne({ email: data.email })

    if (existing) throw new Error("Email already in use")
    
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await User.create({
        ...data,
        password: hashedPassword
    })

    return user

}

export const loginService = async (email: string, password: string) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error("Invalid email or password")

    const match = await comparePassword(password, user.password)

    if (!match) throw new Error("Invalid email or password")

    const { password: _, ...safeUser } = user.toObject()

    return safeUser
}

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
