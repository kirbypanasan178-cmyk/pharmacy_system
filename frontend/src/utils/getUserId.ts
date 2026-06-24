export const getUserId = () => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) {
        console.error("User not found")
        return null
    }

    try {
        const parsedUser = JSON.parse(storedUser)

        if (!parsedUser?._id) {
            console.error("Invalid user structure in local storage")
            return null
        }

        return parsedUser._id

    } catch (err) {
        console.error("Failedto parse user from local storage", err)
        return null
    }
}