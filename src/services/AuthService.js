import { API_URL } from "./api";

export const login = async (data) => {
  const response = await fetch(`${API_URL}/api/Auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  return response.json();
};

export const register = async (data) => {
  const response = await fetch(`${API_URL}/api/Auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    }),
  });

  return response.json();
};

export const authFetch = (url, options = {}) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};