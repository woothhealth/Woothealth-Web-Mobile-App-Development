export async function getProviders() {
    const res = await fetch("/api/providers", {
        cache: "no-store"
    });
    if (!res.ok) {
        throw new Error("Failed to fetch Providers");
    }
    return res.json();
}