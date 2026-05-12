import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDashboardPath, hasDashboardAccess } from "@/lib/roles";
import Adminpag from '@/Hooks/AdminPage'

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const role = cookieStore.get("role")?.value;

  if (session && hasDashboardAccess(role)) {
    redirect(getDashboardPath(role));
  }

  return <Adminpag/>;
}