'use server';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { DASHBOARD_ADMIN_ROLES, getDashboardPath } from "@/lib/roles";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email and password are required.",
      }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: false, message: 'Backend URL not configured' }, { status: 500 });
    }

    // Attempt admin login against backend

    const res = await axios.post(
      `${BACKEND_URL}/login/`,
      { email, password },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );

    const user = res.data;
    // backend response received

    // Check if backend returned an error even with 200 status
    if (user?.error) {
      console.error('Backend returned error field:', user.error);
      return NextResponse.json({ success: false, message: user.error }, { status: 400 });
    }

    if (!user?.userId) {
      console.error('Missing userId in backend response:', user);
      return NextResponse.json({ success: false, message: "Invalid credentials" });
    }

    const normalizeRoleItem = (item: unknown): string[] => {
      if (typeof item === 'string' || typeof item === 'number') {
        return String(item)
          .split(',')
          .map((value) => value.trim().toLowerCase())
          .filter(Boolean);
      }
      if (Array.isArray(item)) {
        return item.flatMap(normalizeRoleItem);
      }
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>;
        const candidate = obj.role ?? obj.name ?? obj.code ?? obj.type;
        return normalizeRoleItem(candidate);
      }
      return [];
    };

    const allRoleValues = [
      ...normalizeRoleItem(user.role),
      ...normalizeRoleItem(user.roles),
    ];

    const adminRole = allRoleValues.find((role: string) => DASHBOARD_ADMIN_ROLES.includes(role as any));

    // roles parsed from backend

    if (!adminRole) {
      console.error('User has no admin role assigned in backend response');
      return NextResponse.json({
        success: false,
        message: "This account does not have admin access.",
      }, { status: 403 });
    }

    const displayRoles = normalizeRoleItem(user.role);
    const fallbackRoles = normalizeRoleItem(user.roles);
    const userRole = displayRoles.find(Boolean) || fallbackRoles.find(Boolean) || adminRole;

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

    // Mirror PHP session if available
    try {
      const possiblePhpSid =
        user?.PHPSESSID || user?.phpSessionId || user?.sessionId || user?.session || null;

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
      console.error("Failed to mirror PHPSESSID:", e);
    }

    const dashboardPath = getDashboardPath(userRole);

    return NextResponse.json({
      success: true,
      role: userRole,
      redirectPath: dashboardPath,
    });
  } catch (error: any) {
    const backendResponse = error.response?.data;
    const statusCode = error.response?.status;
    console.error('Admin Login API Error Details:', {
      status: statusCode,
      fullBackendResponse: JSON.stringify(backendResponse, null, 2),
      error: error.message,
    });
    return NextResponse.json({
      success: false,
      message: error.response?.data?.error || error.response?.data?.message || "Login failed",
    }, { status: error.response?.status || 500 });
  }
}
