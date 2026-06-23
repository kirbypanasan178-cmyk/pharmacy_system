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

// email attatchments
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = [
      "image/jpeg", 
      "image/png", 
      "image/jpg", 
      "image/webp", 
      "application/pdf"
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only image or PDF files are allowed"))
    }
  }
})