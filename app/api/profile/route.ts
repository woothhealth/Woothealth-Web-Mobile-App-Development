import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const backendRes = await fetch(
    "https://backend.woothealth.com/profile/",
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