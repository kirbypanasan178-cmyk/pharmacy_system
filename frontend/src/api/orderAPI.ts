import type {
  AddressFormType,
  PaymentMethod,
  PaymentStatus,
  Status,
} from "../types/order";
import { getToken } from "../utils/getToken";
import { API_URL } from "./apiUrl";

export const createOrderAPI = async (
  userId: string,
  shippingAddress: AddressFormType,
  paymentMethod: PaymentMethod,
  selectedCartItemIds: string[],
  idempotencyKey: string,
) => {
  const token = getToken();
  const response = await fetch(`http://localhost:2000/api/order/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-idempotency-key": idempotencyKey,
    },
    body: JSON.stringify({
      shippingAddress,
      paymentMethod,
      selectedCartItemIds,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Backend error response:", data); // ← add this
    throw new Error(data.error || data.message || JSON.stringify(data));
  }

  return data;
};

export const getAllOrderAPI = async () => {
  const token = getToken();
  const response = await fetch("http://localhost:2000/api/order/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const getOrderAPI = async (id: string) => {
  const token = getToken();
  const response = await fetch(`http://localhost:2000/api/order/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const updateAdminOrderAPI = async (
  id: string,
  status: Status,
  paymentStatus: PaymentStatus,
) => {
  const token = getToken();
  const response = await fetch(`http://localhost:2000/api/order/admin/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
      paymentStatus,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const updateUserOrderAPI = async (id: string, status: Status) => {
  const token = getToken();
  const response = await fetch(`http://localhost:2000/api/order/user/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const getOrdersTodayCountAPI = async () => {
  const token = getToken();
  const response = await fetch("http://localhost:2000/api/order/today/count", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};

export const getSalesTodayAPI = async () => {
  const token = getToken();
  const response = await fetch("http://localhost:2000/api/order/today/sales", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
};


export const cancelOrderAPI = async (orderId: string) => {
  const token = getToken()
  const response = await fetch(`${API_URL}/order/admin/cancel-order/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data

}