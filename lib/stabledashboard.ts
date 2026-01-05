export function stableDashboard(data: any)
{
    return {
        firstName: data?.firstName ?? "User",
        lastName: data?.lastName ?? "Last",
        userId: data?.userId ?? "Nill",
        name: data?.name ?? "No Plan",
        coveredMembers: typeof data?.coveredMembers === 'number' ? data.coveredMembers : 0, 
    }
}