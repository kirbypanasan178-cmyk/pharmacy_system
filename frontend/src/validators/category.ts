import type { CategoryFormType } from "../types/category"

type categoryFields = "name"

export type ValidationErrorsCategory = Partial<Record<categoryFields, string>>

export const categoryValidation = (form: CategoryFormType): ValidationErrorsCategory => {
    const errors: ValidationErrorsCategory = {}

    if (!form.name.trim()) {
        errors.name = "Name is required"
    }

    return errors
}