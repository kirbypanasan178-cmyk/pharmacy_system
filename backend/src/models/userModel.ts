import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiry: {
        type: Date,
        default: null,
    },
    passwordResetToken: {
        type: String,
        default: null,
    },
    passwordResetExpiry: {
        type: Date,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        street: { type: String, required: true },
        barangay: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        zipcode: { type: String, required: true },
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
    },
    age: {
        type: Number,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    birthplace: {
        type: String,
        required: true,
    },
   
},
{ timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User