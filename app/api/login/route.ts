'use server';

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const res = await axios.post(
      "https://backend.woothealth.com/login/",
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

    return NextResponse.json({ success: true, role: user.role });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json({
      success: false,
      message: error.response?.data?.error || "Login failed",
    });
  }
}