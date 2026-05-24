import type { AddressFormType } from "../types/order"

type AddressFields = "fullname" | "street" | "city" | "province" | "postalCode" | "phone"

export type ValidationErrorsOrder = Partial<Record<AddressFields, string>>

export const orderValidation = (form: AddressFormType) => {
    const errors: ValidationErrorsOrder = {}

    if (!form.fullname.trim()) {
        errors.fullname = "Fullname is required"
    }

    if (!form.street.trim()) {
        errors.street = "Street is required"
    }

    if (!form.city.trim()) {
        errors.city = "City is required"
    }

    if (!form.province.trim()) {
        errors.province = "Province is required"
    }

    if (!form.postalCode.trim()) {
        errors.postalCode = "Postal code is required"
    }

    if (!form.phone.trim()) {
        errors.phone = "Phone number is required";
    } else if (!/^09\d{9}$/.test(form.phone)) {
        errors.phone = "Invalid phone number (e.g. 09XXXXXXXXX)";
    }

    return errors
} 