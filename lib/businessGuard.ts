import { NextResponse } from "next/server";

export const parseRoleFromCookie = (cookieHeader: string): string | null => {
  const match = /role=([^;]+)/.exec(cookieHeader || "");
  if (!match) return null;
  return decodeURIComponent(match[1]);
};

export const requireBusinessRole = (cookieHeader: string) => {
  if (!cookieHeader || !cookieHeader.includes("session=")) {
    return NextResponse.json({ error: "Unauthorized: missing session" }, { status: 401 });
  }

  const role = parseRoleFromCookie(cookieHeader);
  if (!role) {
    return NextResponse.json({ error: "Unauthorized: missing role" }, { status: 401 });
  }

  if (role !== "business") {
    return NextResponse.json({ error: "Forbidden: business role required" }, { status: 403 });
  }

  return null;
};

export const getBusinessHeaders = (cookieHeader: string) => {
  return {
    Cookie: cookieHeader,
    "x-user-role": "business",
  };
};
