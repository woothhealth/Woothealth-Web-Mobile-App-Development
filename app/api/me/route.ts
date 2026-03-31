import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    // 1️⃣ Get all cookies from the incoming request
    const cookieHeader = req.headers.get("cookie") || "";
    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Unauthorized - no cookies sent" },
        { status: 401 }
      );
    }

    // 2️⃣ Forward the cookies to the backend
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await axios.get(`${BACKEND_URL}/profile/`, {
      headers: {
        Cookie: cookieHeader, // forward all cookies from browser
      },
      withCredentials: true, // include cookies for cross-origin
    });

    // 3️⃣ Normalize backend response and return the inner profile data when available
    const backendData = backendRes.data;

    // If backend returns an envelope { success: true, data: { ... } }
    if (backendData && typeof backendData === 'object' && backendData.success && backendData.data) {
      return NextResponse.json(backendData.data || {}, { status: backendRes.status });
    }

    // Otherwise return whatever backend sent (useful for errors)
    return NextResponse.json(backendData || {}, { status: backendRes.status });
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

export async function POST(req: Request) {
  try {
    // Build cookie header from incoming request (server-side)
    const cookieHeader = req.headers.get('cookie') || '';

    if (!cookieHeader) {
      return NextResponse.json({ error: 'Unauthorized - no cookies sent' }, { status: 401 });
    }

    const body = await req.json();

    // Forward POST to backend profile endpoint
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await axios.post(`${BACKEND_URL}/profile`, body, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    const backendData = backendRes.data;

    if (backendData && typeof backendData === 'object' && backendData.success && backendData.data) {
      return NextResponse.json(backendData.data, { status: backendRes.status });
    }

    return NextResponse.json(backendData, { status: backendRes.status });
  } catch (error: any) {
    console.error('PROFILE UPDATE ERROR:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: error.response?.status || 500 });
  }
}