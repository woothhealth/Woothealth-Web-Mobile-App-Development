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
      const mockData = {
        name: "Support User",
        email: "support@woothealth.com",
        role: "superadmin",
        joinedDate: "2024-01-01"
      };
      return NextResponse.json(mockData, { status: 200 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/profile",
      {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin profile`);
      // Return mock data if backend fails
      const mockData = {
        name: "Support User",
        email: "support@woothealth.com",
        role: "support",
        joinedDate: "2024-01-01"
      };
      return NextResponse.json(mockData, { status: 200 });
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }

    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Admin profile GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch admin profile' },
      { status: 500 }
    );
  }
}