export const getCartId = (): string | null => {
    return localStorage.getItem("cartId")
}

export const getSelectedCartItemIds = () => {
    const storedSelectedItemIds = localStorage.getItem("selectedItemIds")

    if (!storedSelectedItemIds) return null

    try {
        return JSON.parse(storedSelectedItemIds)
    } catch (err) {   
        console.error("Invalid selectedItemIds in local storage: ", err)
        return null
    }
}