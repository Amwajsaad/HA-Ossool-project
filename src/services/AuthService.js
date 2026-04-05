import { API_URL } from "./api";
export const login = async (date) => {
    const response = await fetch(`${API_URL}/api/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(date),
    });
    return response.json();
}   

export const register = async (date) => {
    const response = await fetch(`${API_URL}/api/Auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },        body: JSON.stringify(date),
    });
    return response.json();
}

