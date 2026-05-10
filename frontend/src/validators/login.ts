import type { LoginFormType } from "../types/user";

type LoginFields = "email" | "password"

export type ValidationErrorsLogin = Partial<Record<LoginFields, string>>


export const loginValidation = (form: LoginFormType): ValidationErrorsLogin => {
  const errors: ValidationErrorsLogin = {};

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

  return errors;
};