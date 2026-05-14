export interface CartItemForm {
    product: string
    price: number
    quantity: number
}

export interface CartForm {
    user: string
    items: CartItemForm[]
    totalPrice: number
}