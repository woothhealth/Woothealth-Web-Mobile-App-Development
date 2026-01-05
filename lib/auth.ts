import { API_BASE_URL } from "./api";

export async function loginUser (email: string, password: string, remeberMe: boolean) {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, remeberMe, }),
    });

    if (!res.ok) {
        throw new Error("Invalid email or password");
    }

    return res.json();
}

export async function getCurrentUser() {
    const res = await fetch(`${API_BASE_URL}/me`, {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
}

export async function logoutUser() {
    await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });
}

export async function registerUser(formData: {
    firstName: string;
      lastName: string;
      phoneNumber: string;
      email: string;
      state: string;
      address: string;
      password: string;
      age: string;
      check: boolean;
}) {
    const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
    }

    return res.json();
}