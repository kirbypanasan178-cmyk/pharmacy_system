export const getOrderId = () => {
    const storedOrderId = localStorage.getItem("orderId")

    return storedOrderId ? storedOrderId : null
}