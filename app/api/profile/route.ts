import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const backendRes = await fetch(
    (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL) + "/profile/",
    {
      headers: {
        Cookie: req.headers.get("cookie") ?? "",
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: backendRes.status }
    );
  }

  const data = await backendRes.json();
  return NextResponse.json(data);
}