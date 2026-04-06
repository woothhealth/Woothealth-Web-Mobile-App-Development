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
        totalUsers: 16,
        totalEnrollees: 0,
        activeClients: 0,
        telemedicineRequests: 0
      }, { status: 200 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/admin/overview/",
      {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: "include",
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin overview`);
      // Return mock data if backend fails
      return NextResponse.json({
        totalUsers: 16,
        totalEnrollees: 0,
        activeClients: 0,
        telemedicineRequests: 0
      }, { status: 200 });
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }

    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Admin overview GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch admin overview' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const body = await req.json();

    const backendRes = await fetch(
      BACKEND_URL + "/admin/overview/",
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
      console.warn(`Backend returned ${backendRes.status} for admin overview POST`);
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }

    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Admin overview POST error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to update admin overview' },
      { status: 500 }
    );
  }
}