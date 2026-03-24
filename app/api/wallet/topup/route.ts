import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      throw new Error("Backend URL not configured");
    }

    const body = await req.json();

    const res = await fetch(`${BACKEND_URL}/wallet/topup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") ?? "",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to initialize wallet top-up" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}