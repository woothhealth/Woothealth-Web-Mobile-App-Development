import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await axios.post(
      "https://backend.ekensloaded.com.ng/signup",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          // 🔐 If backend requires auth, attach it here
          // Authorization: `Bearer ${process.env.BACKEND_TOKEN}`,
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.response?.data?.error ||
          "Signup failed",
      },
      { status: error?.response?.status || 500 }
    );
  }
}
