import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    // 1️⃣ Get all cookies from the incoming request
    const cookieHeader = req.headers.get("cookie") || "";
    console.log("Incoming Cookies:", cookieHeader);
    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Unauthorized - no cookies sent" },
        { status: 401 }
      );
    }

    // 2️⃣ Forward the cookies to the backend
    const backendRes = await axios.get("https://backend.woothealth.com/profile", {
      headers: {
        Cookie: cookieHeader, // forward all cookies from browser
      },
      withCredentials: true, // include cookies for cross-origin
    });

    // 3️⃣ Return backend profile data to the frontend
    return NextResponse.json(backendRes.data);
  } catch (error: any) {
    console.error(
      "BACKEND ERROR:",
      error.response?.data || error.message
    );

    // 4️⃣ Return a generic error for frontend
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}