import { API_BASE_URL } from "./api";

export async function getProviders() {
    const res = await fetch(`${API_BASE_URL}/providers`, {
        credentials: "include",
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch Providers");
    }

    return res.json();
}