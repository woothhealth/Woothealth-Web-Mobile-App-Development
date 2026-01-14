import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/api/users";
import Welcome from "./Welcome";

export default async function RetailDashboardPage() {
  const session = await getSession();

  if (!session || !session.id) {
    redirect("/login");
  }

  const user = await getUserById(session.id);

  return (
    <div>
      <Welcome
        userId={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
      />
    </div>
  );
}