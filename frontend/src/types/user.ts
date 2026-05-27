export interface UserInfo {
    _id: string
    fullname: string;
    age: number;
    gender: "male" | "female" | "other";
    birthdate: Date;
    birthplace: string;
    address: {
        street: string;
        barangay: string;
        city: string;
        province: string;
        zipcode: string;
    }
    email: string;
}

export interface User {
    _id: string
    users: UserInfo
    role: string
    isActive: boolean
    createdAt: string
    totalOrders: number
}

export type SignupFormType = {
    fullname: string;
    age: number;
    gender: "male" | "female" | "other";
    birthdate: string;
    birthplace: string;
    phone: string;
    address: {
        street: string;
        barangay: string;
        city: string;
        province: string;
        zipcode: string;
    }
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginFormType {
    email: string;
    password: string;
    rememberMe: false;
}