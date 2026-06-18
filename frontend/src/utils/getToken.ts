export const getToken = (): string | null => {
    const user = localStorage.getItem("user")

    if (!user) return null

    const parsedUser = JSON.parse(user)

    return parsedUser?.token ?? null
}