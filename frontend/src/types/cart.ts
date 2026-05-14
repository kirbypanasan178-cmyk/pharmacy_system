export interface CartItemForm {
    product: string
    price: number
    quantity: number
}

export interface CartForm {
    items: CartItemForm[]
}