import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

const paymongoSecret = process.env.PAYMONGO_SECRET_KEY || ""

const config = {
  PORT: process.env.PORT || "2000",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",
  PAYPAL_BASE: process.env.PAYPAL_BASE || "https://api-m.sandbox.paypal.com",
  
  PAYMONGO_BASE: process.env.PAYMONGO_BASE || "https://api.paymongo.com/v1",
  PAYMONGO_SECRET_KEY: paymongoSecret,
  PAYMONGO_PUBLIC_KEY: process.env.PAYMONGO_PUBLIC_KEY || "",
  PAYMONGO_AUTH: paymongoSecret ? Buffer.from(process.env.PAYMONGO_SECRET_KEY + ":").toString("base64")
  : "w"
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export { cloudinary }
export default config