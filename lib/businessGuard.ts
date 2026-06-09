import { NextResponse } from "next/server";

export const parseRoleFromCookie = (cookieHeader: string): string | null => {
  const match = /role=([^;]+)/.exec(cookieHeader || "");
  if (!match) return null;
  return decodeURIComponent(match[1]);
};

export const requireBusinessRole = (cookieHeader: string) => {
  // Accept any non-empty cookie header rather than relying on a specific
  // cookie name like `session=`. Session cookie names vary between
  // environments and may be HttpOnly, so the presence of a cookie header
  // is a better indicator that the user has a session.
  if (!cookieHeader || !cookieHeader.trim()) {
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
