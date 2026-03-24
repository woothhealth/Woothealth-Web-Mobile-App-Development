import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL && cookieHeader) {
      try {
        await fetch(`${BACKEND_URL}/logout`, {
          method: "POST",
          headers: {
            Cookie: cookieHeader,
          },
          credentials: "include",
        });
      } catch (e) {
        console.warn("Failed to call backend logout", e);
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("role");
    cookieStore.delete("PHPSESSID");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout endpoint error:', error?.message || error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
