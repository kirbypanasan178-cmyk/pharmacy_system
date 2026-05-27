import type { LoginFormType, SignupFormType, User } from "../types/user";

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

export const getUserAPI = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:2000/api/user/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to get user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
};

export const getAllUsersAPI = async () => {
  try {
    const response = await fetch("http://localhost:2000/api/user/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to all users");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
};

export const updateUserAPI = async (userId: string, form: User) => {
  try {
    const response = await fetch(`http://localhost:2000/api/user/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to update user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
};

export const deleteUserAPI = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:2000/api/user/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Failed to delete user");
    }

    return data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
};

export const blockUserAPI = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:2000/api/user/block/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await response.json()

  if (!response.ok) {
      throw new Error(data?.error || "Failed to block user");
  }

  return data

  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

export const unblockUserAPI = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:2000/api/user/unblock/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await response.json()

  if (!response.ok) {
      throw new Error(data?.error || "Failed to unblock user");
  }

  return data

  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}