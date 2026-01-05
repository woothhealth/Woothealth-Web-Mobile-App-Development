import { API_BASE_URL } from "./api";
import { stableDashboard } from "./stabledashboard";

export async function getDashboard() {
    const res = await fetch(`${API_BASE_URL}/users`, {
        credentials: "include",
        cache: "no-store",
    });

    if (!res.ok) {
        return stableDashboard({});
    }

    const data = await res.json();
    return stableDashboard(data);
}

export async function getDashboardPlan() {
    const res = await fetch(`${API_BASE_URL}/plans`, {
        credentials: "include",
        cache: "no-store",
    });

    if(!res.ok) {
        return stableDashboard({});
    }

    const data = await res.json();
    return stableDashboard(data);
}