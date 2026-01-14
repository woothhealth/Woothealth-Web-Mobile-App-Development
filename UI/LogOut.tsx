"use client";

import { useLogout } from "@/lib/useLogOut";
import { RiLogoutBoxRLine } from "react-icons/ri";

type LogoutButtonProps = {
  collapsed?: boolean;
};

const LogoutButton = ({ collapsed = false }: LogoutButtonProps) => {
  const { logout, isPending } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={isPending}
      className={`flex items-center gap-2 py-3 w-full ${collapsed ? 'justify-center' : 'pl-5'}`}
      title={collapsed ? "Logout font-xl" : undefined}
    >
      <RiLogoutBoxRLine className={`${collapsed ? 'text-2xl' : 'text-xl'}`} />
      {!collapsed && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
