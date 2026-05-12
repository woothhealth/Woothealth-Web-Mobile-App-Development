'use server';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

type LoginMode = "login" | "admin" | "provider";

const ALLOWED_ROLES_BY_MODE: Record<LoginMode, readonly string[]> = {
  login: ["business", "retail"],
  admin: ["admin", "superadmin", "sales", "ops", "csupport", "claims", "underwriting", "finance", "hr"],
  provider: ["provider"],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string; mode?: unknown };
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");
    const loginMode: LoginMode | null =
      body.mode === "login" || body.mode === "admin" || body.mode === "provider" ? body.mode : null;
    if (!loginMode) {
      return NextResponse.json({
        success: false,
        message: "Login mode must be either 'login', 'admin', or 'provider'.",
      }, { status: 400 });
    }

    const allowedRoles = ALLOWED_ROLES_BY_MODE[loginMode];

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: false, message: 'Backend URL not configured' }, { status: 500 });
    }

    const res = await axios.post(
      `${BACKEND_URL}/login/`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const user = res.data;

    if (!user?.userId) {
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }

    const userRole = String(user.role ?? "");
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({
        success: false,
        message: "This account is not allowed to log in from this page.",
      });
    }

    const cookieStore = (await cookies());
    cookieStore.set("session", user.userId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });
    cookieStore.set("role", userRole, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });

    // If backend returned a PHP session id in the response body or Set-Cookie header,
    // mirror it to the browser as PHPSESSID so PHP backends can recognize the session.
    try {
      // 1) Check common fields in response body
      const possiblePhpSid =
        user?.PHPSESSID || user?.phpSessionId || user?.sessionId || user?.session || null;

      // 2) Or check Set-Cookie header from backend
      let phpSidFromHeader: string | null = null;
      const setCookieHeader = (res.headers as any)?.["set-cookie"] || (res.headers as any)?.["Set-Cookie"];
      if (setCookieHeader) {
        const headersArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        for (const ck of headersArray) {
          const m = /PHPSESSID=([^;]+)/i.exec(ck);
          if (m) {
            phpSidFromHeader = m[1];
            break;
          }
        }
      }

      const phpSid = possiblePhpSid || phpSidFromHeader;
      if (phpSid) {
        cookieStore.set("PHPSESSID", String(phpSid), {
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 8,
        });
      }
    } catch (e) {
      // Non-fatal: if header parsing fails, continue without PHPSESSID
      console.error("Failed to mirror PHPSESSID:", e);
    }

    return NextResponse.json({ success: true, role: user.role });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      message: error.response?.data?.error || "Login failed",
    });
  }
}