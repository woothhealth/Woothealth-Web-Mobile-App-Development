import { API_BASE_URL } from "./api";
import { stableDasTransac } from "./stableDashTransac";

export async function getTransaction() {
    const res = await fetch(`${API_BASE_URL}/finance`,
        {
            credentials: "include",
            cache: "no-store",
        }
    );

    if (!res.ok) {
        return stableDasTransac({});
    }

    const data = await res.json();
    return stableDasTransac(data);
}