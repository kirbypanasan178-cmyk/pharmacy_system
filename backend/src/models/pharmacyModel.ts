import mongoose, { Document } from "mongoose"
import { Schema } from "mongoose"

export interface IPharmacy extends Document {
    name: string
    address: string
    phone: string
    location: {
        lat: number
        lng: number
    }
    isOpen: boolean
    createdAt: Date
}

const pharmacySchema = new Schema<IPharmacy>(
    {
        name: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        },
        isOpen: { type: Boolean, default: true },
    },
    { timestamps: true }
)

const Pharmacy = mongoose.model<IPharmacy>("Pharmacy", pharmacySchema)

export default Pharmacy