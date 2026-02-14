'use server';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

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

    const cookieStore = (await cookies());
    cookieStore.set("session", user.userId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1,
    });
    cookieStore.set("role", user.role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2,
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
          maxAge: 60 * 60 * 2,
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