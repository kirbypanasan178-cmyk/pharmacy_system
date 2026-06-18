import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

const config = {
  PORT: process.env.PORT || "2000",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",

   PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || "",
  PAYPAL_BASE: process.env.PAYPAL_BASE || "https://api-m.sandbox.paypal.com",

}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export { cloudinary }
export default config