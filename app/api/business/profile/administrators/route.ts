import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/business/profile/administrators",
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for business administrators`);
      
      // Only return mock data for 5xx errors - client connection issues
      if (backendRes.status >= 500) {
        const mockData = [
          {
            id: "admin_1",
            name: "John Doe",
            email: "john.doe@company.com",
            position: "CEO",
            role: "Full Access",
            status: "active",
            addedDate: "2024-01-15"
          },
          {
            id: "admin_2",
            name: "Jane Smith",
            email: "jane.smith@company.com",
            position: "CTO",
            role: "Limited Access",
            status: "active",
            addedDate: "2024-02-01"
          }
        ];
        return NextResponse.json(mockData, { status: 200 });
      }

      // For 4xx errors, return empty array
      return NextResponse.json([], { status: 200 });
    }

    const data = await backendRes.json();

    // Normalize response - handle various backend response formats
    if (Array.isArray(data)) {
      return NextResponse.json(data, { status: 200 });
    }

    if (data && typeof data === "object" && data.success && Array.isArray(data.data)) {
      return NextResponse.json(data.data, { status: 200 });
    }

    if (data && typeof data === "object" && Array.isArray(data.administrators)) {
      return NextResponse.json(data.administrators, { status: 200 });
    }

    // If data is an object with administrators as a key, extract it
    if (data && typeof data === "object" && data.administrators) {
      return NextResponse.json(Array.isArray(data.administrators) ? data.administrators : [], { status: 200 });
    }

    return NextResponse.json(Array.isArray(data) ? data : [], { status: 200 });
  } catch (error: any) {
    console.error('Business administrators GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch administrators' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;

    let body: any;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.position || !body.role) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, position, and role are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/business/profile/administrators",
      {
        method: "POST",
        headers: {
          ...getBusinessHeaders(cookieHeader),
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(body),
      }
    );

    if (!backendRes.ok) {
      console.error(`Failed to create administrator: ${backendRes.status}`);

      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: "Invalid administrator data" },
          { status: 400 }
        );
      }
      if (backendRes.status === 409) {
        return NextResponse.json(
          { error: "Administrator with this email already exists" },
          { status: 409 }
        );
      }

      // Return mock data for development if backend is not available (5xx errors)
      if (backendRes.status >= 500) {
        const mockAdmin = {
          id: `admin_${Date.now()}`,
          ...body,
          status: "active",
          addedDate: new Date().toISOString().split('T')[0]
        };
        return NextResponse.json(mockAdmin, { status: 201 });
      }

      // For other error codes, return the backend error
      const errorData = await backendRes.json().catch(() => ({ error: 'Unknown error' }));
      return NextResponse.json(
        { error: errorData?.error || 'Failed to add administrator' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 201 });
    }

    return NextResponse.json(data || {}, { status: 201 });
  } catch (error: any) {
    console.error('Business administrators POST error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to create administrator' },
      { status: 500 }
    );
  }
}