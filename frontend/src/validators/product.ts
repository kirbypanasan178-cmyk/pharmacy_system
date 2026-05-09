import type {  ProductFormType } from "../types/product";
import type { ValidationErrors } from "../types/validation";

export const productValidation = (form: ProductFormType) => {
    const errors: ValidationErrors = {}

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