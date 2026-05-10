import mongoose from "mongoose"

const Schema = mongoose.Schema

const productSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    }
    
}, { timestamps: true } )

const Product = mongoose.model("Product", productSchema)

export default Product