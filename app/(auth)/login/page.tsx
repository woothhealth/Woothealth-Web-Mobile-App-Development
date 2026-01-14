import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginPag from '@/Hooks/LoginPage'

export default async function LoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  const role = cookieStore.get("role")?.value;

  if (session) {
    redirect(
      role === "business"
        ? "/dashboard/business"
        : "/dashboard/retail"
    );
  }

  return <LoginPag/>;
}