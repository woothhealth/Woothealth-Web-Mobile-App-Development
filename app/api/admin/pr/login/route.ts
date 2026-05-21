'use server';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: false, message: 'Backend URL not configured' }, { status: 500 });
    }

    const res = await axios.post(
      `${BACKEND_URL}/provider/login/`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    );

    const user = res.data;
    if (user?.error) {
      return NextResponse.json({ success: false, message: user.error }, { status: 400 });
    }
    if (!user?.userId) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }

    // determine role (for provider flows we accept provider role without restriction)
    const role = (Array.isArray(user.role) ? user.role[0] : user.role) || (Array.isArray(user.roles) ? user.roles[0] : user.roles) || 'provider';

    const cookieStore = (await cookies());
    cookieStore.set('session', user.userId, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
    });
    cookieStore.set('role', String(role), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
    });

    // mirror PHPSESSID if present
    try {
      const possiblePhpSid = user?.PHPSESSID || user?.phpSessionId || user?.sessionId || user?.session || null;
      let phpSidFromHeader: string | null = null;
      const setCookieHeader = (res.headers as any)?.['set-cookie'] || (res.headers as any)?.['Set-Cookie'];
      if (setCookieHeader) {
        const headersArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        for (const ck of headersArray) {
          const m = /PHPSESSID=([^;]+)/i.exec(ck);
          if (m) { phpSidFromHeader = m[1]; break; }
        }
      }
      const phpSid = possiblePhpSid || phpSidFromHeader;
      if (phpSid) {
        cookieStore.set('PHPSESSID', String(phpSid), {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 8,
        });
      }
    } catch (e) {
      console.error('Failed to mirror PHPSESSID for admin/pr/login:', e);
    }

    return NextResponse.json({ success: true, role: String(role) });
  } catch (error: any) {
    const backendResponse = error.response?.data;
    const statusCode = error.response?.status;
    console.error('admin/pr Login API Error Details:', { status: statusCode, fullBackendResponse: JSON.stringify(backendResponse, null, 2), error: error.message });
    return NextResponse.json({ success: false, message: error.response?.data?.error || error.response?.data?.message || 'Login failed' }, { status: error.response?.status || 500 });
  }
}
