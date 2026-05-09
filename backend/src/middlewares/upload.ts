import multer from "multer"
import { CloudinaryStorage  } from "multer-storage-cloudinary"
import { cloudinary } from "../config/env"

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  }),
})

export const upload = multer({ storage })