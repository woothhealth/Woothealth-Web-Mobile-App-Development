'use server'

import { UserType } from "@/types/login";
import { cookies } from "next/headers";

const SESSION_KEY = "session";

export const setSession = async (data: { id: string; role: string }) => {
  (await cookies()).set(
    SESSION_KEY,
    JSON.stringify(data),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    }
  );
};

export const getSession = async () => {
  const value = (await cookies()).get(SESSION_KEY)?.value;
  if (!value) return null;

  return JSON.parse(value) as {
    id: string;
    role: string;
  };
};

export const deleteSession = async() => {
  (await cookies()).delete(SESSION_KEY);
}