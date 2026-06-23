import express, { NextFunction, Request, Response } from "express"
import { uploadMemory } from "../middlewares/upload"
import multer from "multer"
import { transporter } from "../utils/mailer"
import config from "../config/env"

const router = express.Router()

// this route has two middleware functions
router.post(
    "/send-file",
    (req: Request, res: Response, next: NextFunction) => { // runs first
        uploadMemory.single("file")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: "File too large. Max 5mb." })
            } else if (err) {
                return res.status(400).json({ success: false, message: err.message })
            }
            next()
        })
    },
    async (req: Request, res: Response) => {
        try {
            const file = req.file

            if (!file) {
                return res.status(400).json({ success: false, message: "No file provided" })
            }

            await transporter.sendMail({
                from: `Pharmacare <${config.SMTP_USER}>`,
                to: config.SMTP_USER,
                subject: "New file from user",
                text: "A user has submitted a file",
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