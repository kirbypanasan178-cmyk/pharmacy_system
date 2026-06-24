import express, { NextFunction, Request, Response } from "express"
import { uploadMemory } from "../middlewares/upload"
import multer from "multer"
import { transporter } from "../utils/mailer"
import config from "../config/env"
import { requireAuth } from "../middlewares/requireAuth"
import User from "../models/userModel"

const router = express.Router()

router.use(requireAuth)
// this route has two middleware functions
router.post(
    "/send-file",
    (req: Request, res: Response, next: NextFunction) => { // runs first
        uploadMemory.single("file")(req, res, (err) => {   // file type sending from the frontend should be file
            if (err instanceof multer.MulterError) {       
                return res.status(400).json({ success: false, message: "File too large. Max 5mb." })
            } else if (err) {
                return res.status(400).json({ success: false, message: err.message })
            }
            // go to the next middleware function if theres no error
            next()
        })
    },
    // admin recieves the file uploaded by the user
    async (req: Request, res: Response) => {
        try {
            // get the uploaded file stores in the memory
            const file = req.file
            const user = await User.findById(req.user?._id)

            if (!user) {
                return res.status(404).json({
                success: false,
                message: "User not found"
            })
            }

            console.log("User info: ", user)
            // stop the function and return a 400 response if file not found
            if (!file) {
                return res.status(400).json({ success: false, message: "No file provided" })
            }

            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized user"})
            }
            // send email using nodemailer
            await transporter.sendMail({
                from: `Pharmacare <${config.SMTP_USER}>`,
                to: config.SMTP_USER,
                subject: "New file from user",
                text: `
                Customer Name: ${user.fullname},
                Customer Email: ${user.email},
                `,
                attachments: [
                    {
                        filename: file.originalname,
                        content: file.buffer,
                        contentType: file.mimetype,
                    }
                ]
            })

            res.json({ success: true, message: "File sent successfully" })
        } catch (error) {
            console.error("Mail error: ", error)
            res.status(500).json({ success: false, message: "Failed to send file" })
        }
    }
)


export default router