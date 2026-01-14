import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/api/users";
import UserUi from "./UserUi";

export default async function RetailDashboardPage() {
  const session = await getSession();

  if (!session || !session.id) {
    redirect("/login");
  }

  const user = await getUserById(session.id);

  return (
    <div>
      <UserUi
        firstName={user.firstName}
      />
    </div>
  );
}
