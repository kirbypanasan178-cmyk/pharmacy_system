import type { SignupFormType } from "../types/user";

type SignupFields =
  | "fullname"
  | "age"
  | "gender"
  | "birthdate"
  | "birthplace"
  | "phone"
  | "email"
  | "password"
  | "confirmPassword"
  | "street"
  | "barangay"
  | "city"
  | "province"
  | "zipcode";

export type ValidationErrorsSignup = Partial<Record<SignupFields, string>>;

export const signupValidation = (form: SignupFormType): ValidationErrorsSignup => {
  const errors: ValidationErrorsSignup = {};

  if (!form.fullname.trim()) errors.fullname = "Full name is required";

  if (!form.age || form.age <= 0) errors.age = "Valid age is required";

  if (!form.gender) errors.gender = "Gender is required";

  if (!form.birthdate) errors.birthdate = "Birthdate is required";

  if (!form.birthplace.trim()) errors.birthplace = "Birthplace is required";

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^09\d{9}$/.test(form.phone)) {
    errors.phone = "Invalid phone number (e.g. 09XXXXXXXXX)";
  }

  if (!form.address.street.trim()) errors.street = "Street is required";
  if (!form.address.barangay.trim()) errors.barangay = "Barangay is required";
  if (!form.address.city.trim()) errors.city = "City is required";
  if (!form.address.province.trim()) errors.province = "Province is required";
  if (!form.address.zipcode.trim()) errors.zipcode = "Zipcode is required";

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

  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
