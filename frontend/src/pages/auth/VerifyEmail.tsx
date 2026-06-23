import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const [message, setMessage] = useState("Verifying...")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const token = searchParams.get("token")
        if (!token) {
            setMessage("Invalid verification link.")
            return
        }

        fetch(`http://localhost:2000/api/user/verify-email?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSuccess(true)
                    setMessage("Email verified! You can now log in.")
                } else {
                    setMessage(data.message || "Verification failed.")
                }
            })
            .catch(() => setMessage("Something went wrong. Please try again."))
    }, [])

    return (
        <div>
            <h2>{success ? "✅" : "❌"} {message}</h2>
        </div>
    )
}