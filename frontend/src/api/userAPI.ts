import type { LoginFormType, SignupFormType } from "../types/user";

export const signupUserAPI = async (form: SignupFormType) => {
  try {
    const response = await fetch("http://localhost:2000/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to signup user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
};

export const loginUserAPI = async (form: LoginFormType) => {
  try {
    const response = await fetch("http://localhost:2000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to login user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
};