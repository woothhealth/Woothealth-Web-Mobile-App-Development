import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const cookieStore = (await cookies());
  cookieStore.set("session", data.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  cookieStore.set("role", data.role, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return NextResponse.json({ success: true });
}
