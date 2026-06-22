export const getCartId = () => {
    const storedCartId = localStorage.getItem("cartId")

    return storedCartId ? storedCartId : null
}