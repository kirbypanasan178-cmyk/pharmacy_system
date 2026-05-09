import type { LoginFormType, SignupFormType } from "../types/user";
import type { ValidationErrors } from "../types/validation";

export const userValidation = (form: SignupFormType): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Fullname
  if (!form.fullname.trim()) {
    errors.fullname = "Full name is required";
  }

  // Age
  if (!form.age || form.age <= 0) {
    errors.age = "Valid age is required";
  }

  // Gender
  if (!form.gender) {
    errors.gender = "Gender is required";
  }

  // Birthdate
  if (!form.birthdate) {
    errors.birthdate = "Birthdate is required";
  }

  // Birthplace
  if (!form.birthplace.trim()) {
    errors.birthplace = "Birthplace is required";
  }

  // Phone (basic PH format)
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^09\d{9}$/.test(form.phone)) {
    errors.phone = "Invalid phone number (e.g. 09XXXXXXXXX)";
  }

  // Address
  if (!form.address.street.trim()) {
    errors.street = "Street is required";
  }
  if (!form.address.barangay.trim()) {
    errors.barangay = "Barangay is required";
  }
  if (!form.address.city.trim()) {
    errors.city = "City is required";
  }
  if (!form.address.province.trim()) {
    errors.province = "Province is required";
  }
  if (!form.address.zipcode.trim()) {
    errors.zipcode = "Zipcode is required";
  }

  // Email
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }

  // Password
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Confirm Password
  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export const loginValidation = (form: LoginFormType): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }

  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors

}