export const getUserId = () => {
    const storedUser = localStorage.getItem("user")
    const parsedUser = storedUser ? JSON.parse(storedUser) : null

    return parsedUser.user._id
}