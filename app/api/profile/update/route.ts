import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest) {
  try {
    // Get cookies from request
    const cookieStore = await cookies();
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (!cookieHeader) {
      return NextResponse.json(
        { error: "Unauthorized - no session" },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await req.json();

    // Call backend API to update profile
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await axios.put(
      `${BACKEND_URL}/profile`,
      body,
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    // Return updated profile data
    const updatedData = backendRes.data;

    // If wrapped in envelope, unwrap it
    if (updatedData && typeof updatedData === "object" && updatedData.success && updatedData.data) {
      return NextResponse.json(updatedData.data, { status: 200 });
    }

    return NextResponse.json(updatedData, { status: 200 });
  } catch (error: any) {
    console.error("Profile update error:", error.response?.data || error.message);

    return NextResponse.json(
      {
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to update profile",
      },
      { status: error.response?.status || 500 }
    );
  }
}
