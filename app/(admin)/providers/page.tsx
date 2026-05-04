import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProvidersLogin from "@/Hooks/ProvidersLogin";

export default async function ProvidersPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const role = cookieStore.get("role")?.value;

  if (session) {
    redirect(
      role === "provider"
        ? "/dashboard/providers"
        : "/providers"
    );
  }

  return <ProvidersLogin/>;
}