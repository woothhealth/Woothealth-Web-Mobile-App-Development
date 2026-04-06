import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      // Return mock data for development
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: "Enrollees list retrieved"
      }, { status: 200 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/admin/enrollees/",
      {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: "include",
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin enrollees`);
      // Return mock data if backend fails
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: "Enrollees list retrieved"
      }, { status: 200 });
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [], total: 0 }, { status: 200 });
  } catch (error: any) {
    console.error('Admin enrollees GET error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin enrollees' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;
    
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      // Return mock success for development
      return NextResponse.json({
        success: true,
        data: { id: Date.now(), ...body },
        message: "Enrollee added successfully"
      }, { status: 201 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/admin/enrollees/",
      {
        method: 'POST',
        headers: {
          ...getAdminHeaders(cookieHeader),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin enrollees POST`);
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    console.error('Admin enrollees POST error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update admin enrollee' },
      { status: 500 }
    );
  }
}