import type {  ProductFormType } from "../types/product";

type ProductFields = "name" | "price" | "category" | "stock"

export type ValidationErrorsProduct = Partial<Record<ProductFields, string>>

export const productValidation = (form: ProductFormType): ValidationErrorsProduct => {
    const errors: ValidationErrorsProduct = {}

    if (!form.name.trim()) {
        errors.name = "Product name is required"
    }

    if (!form.price) {
        errors.price = "Price is required"
    }
    else if (form.price < 0){
        errors.price = "Product cannot be negative"
    }

    if (!form.category) {
        errors.category = "Category is required"
    }

    if (!form.stock) {
        errors.stock = "Stock is required"
    } else if (form.stock < 0) {
        errors.stock = "Stock cannot be negative"
    }

    return errors

}