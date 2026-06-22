import { Navigate } from "react-router-dom"

interface Props {
    children: React.ReactNode
    adminOnly?: boolean
}

export const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
    const user = localStorage.getItem("user")

    if (!user) return <Navigate to="/login" replace />

    try {
        const parsed = JSON.parse(user)

        if (adminOnly && parsed.user.role !== "admin") {
            return <Navigate to="/home" replace />
        }
    } catch {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}