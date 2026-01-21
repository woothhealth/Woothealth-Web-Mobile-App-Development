// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const SESSION_KEY = "app_session";

export function proxy(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_KEY)?.value;
  const url = req.nextUrl.pathname;

  if (!cookie) {
    if (url.startsWith("/business") || url.startsWith("/retail")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  let session;
  try {
    session = JSON.parse(cookie);
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (url.startsWith("/business") && session.role !== "business") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/retail") && session.role !== "retail") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/business/:path*", "/retail/:path*"],
};
