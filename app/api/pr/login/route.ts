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
    // Accept provider identifier: username (WHP/...), email, or id
    const body = await req.json() as { username?: string; email?: string; id?: string; password?: string };
    const identifier = String(body.username ?? body.email ?? body.id ?? "");
    const password = String(body.password ?? "");

    if (!identifier || !password) {
      return NextResponse.json({ success: false, message: 'username (or email/id) and password are required' }, { status: 400 });
    }

    // This route is provider-only
    const allowedRoles = ALLOWED_ROLES_BY_MODE['provider'];

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: false, message: 'Backend URL not configured' }, { status: 500 });
    }

    const res = await axios.post(
      `${BACKEND_URL}/provider/login/`,
      { username: identifier, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const resp = res.data;
    // Backend may return an envelope { success, role, data: { providerId, ... } }
    // Normalize into `user` object that contains a `userId` and `role` where possible.
    let user: any = resp;
    try {
      if (resp && typeof resp === 'object' && resp.success && resp.data && typeof resp.data === 'object') {
        // merge top-level fields (like role) into data object while preferring data fields
        user = { ...(resp.data || {}), ...(resp || {}) };
      }
    } catch (e) {
      user = resp;
    }

    // Check if backend returned an error even with 200 status
    if (user?.error) {
      // console.error('Backend returned error field:', user.error);
      return NextResponse.json({ success: false, message: user.error }, { status: 400 });
    }

    // Ensure we have a usable userId: look for common fields including providerId
    const extractedUserId = user?.userId || user?.id || user?.providerId || user?.$id || (resp && resp.data && (resp.data.providerId || resp.data.userId || resp.data.id));
    if (!extractedUserId) {
      // console.error('Missing userId in backend response:', resp);
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }
    user.userId = extractedUserId;

    const userRoles: string[] = Array.isArray(user.role)
      ? user.role.map(String)
      : Array.isArray(user.roles)
      ? user.roles.map(String)
      : [String(user.role ?? user.roles ?? "")].filter(Boolean);
    
    if (userRoles.length === 0) {
      // console.error('User has no roles assigned in backend response');
      return NextResponse.json({ success: false, message: "User has no role assigned" });
    }
    
    // Check if user has at least one allowed role for this login mode
    const hasAllowedRole = userRoles.some(role => allowedRoles.includes(String(role)));
    if (!hasAllowedRole) {
      // console.warn(`User roles "${userRoles.join(', ')}" not in allowed roles: ${allowedRoles.join(', ')}`);
      return NextResponse.json({
        success: false,
        message: "This account is not allowed to log in from this page.",
      });
    }

    // Determine primary role for cookie storage (prioritize admin roles)
    const primaryRole = userRoles.find(role => allowedRoles.includes(String(role))) || userRoles[0];

    const cookieStore = (await cookies());
    cookieStore.set("session", user.userId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    });
    cookieStore.set("role", String(primaryRole), {
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
      // console.error("Failed to mirror PHPSESSID:", e);
    }

    return NextResponse.json({ success: true, role: String(primaryRole) });
  } catch (error: any) {
    const backendResponse = error.response?.data;
    const statusCode = error.response?.status;
    // console.error('Login API Error Details:', {
    //   status: statusCode,
    //   fullBackendResponse: JSON.stringify(backendResponse, null, 2),
    //   error: error.message,
    //   stack: error.stack,
    // });
    return NextResponse.json({
      success: false,
      message: error.response?.data?.error || error.response?.data?.message || "Login failed",
    }, { status: error.response?.status || 500 });
  }
}