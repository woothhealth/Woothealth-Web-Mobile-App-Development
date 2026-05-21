"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { logoutAction } from "@/lib/auth";

export const useLogout = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      const res = await logoutAction();
      const dest = res?.redirectTo || "/login";
      router.push(dest);
    });
  };

  return {
    logout,
    isPending,
  };
};
