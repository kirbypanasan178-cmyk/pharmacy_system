import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export const ActiveUserRoute = ({
    children,
}: { 
    children: React.ReactNode 
}) => {
    const user = useSelector((state: any) => state.auth.user)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!user.isActive) {
        return <Navigate to="/account/verification" />
    }

    return <>{children}</>
}