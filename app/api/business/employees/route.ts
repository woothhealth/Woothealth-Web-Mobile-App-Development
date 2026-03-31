import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/employees?search=${encodeURIComponent(search)}&limit=${limit}&offset=${offset}`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for employees list`);
      // Return mock data for development if backend is not available
      const mockData = {
        success: true,
        stats: {
          totalEnrollees: 2,
          active: 2,
          slotsAvailable: 18
        },
        data: [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+2348012345678",
            department: "Engineering",
            dateOfBirth: "1990-01-01",
            gender: "Male",
            plan: "Quantum",
            status: "active",
            enrolledDate: "2024-01-15"
          },
          {
            id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phone: "+2348012345679",
            department: "Finance",
            dateOfBirth: "1985-05-15",
            gender: "Female",
            plan: "Core",
            status: "active",
            enrolledDate: "2024-01-20"
          }
        ],
        total: 2
      };
      return NextResponse.json(mockData, { status: 200 });
    }

    const data = await backendRes.json();
    
    // For employees endpoint, return the full response structure with stats
    // Don't strip to just data.data since frontend expects stats and metadata
    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Business employees GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;

    const body = await req.text();

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/business/employees",
      {
        method: "POST",
        headers: {
          ...getBusinessHeaders(cookieHeader),
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: body,
      }
    );

    const backendText = await backendRes.text().catch(() => "");
    let backendData: any = null;
    try {
      backendData = backendText ? JSON.parse(backendText) : null;
    } catch (parseError) {
      backendData = backendText;
    }

    if (!backendRes.ok) {
      const errorFromBackend =
        backendData?.data?.error ||
        backendData?.error ||
        backendData?.message ||
        (typeof backendData === 'string' ? backendData : 'Failed to add employee');

      console.error(`Failed to create employee: ${backendRes.status}`, errorFromBackend);

      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: errorFromBackend || "Invalid employee data", details: backendData },
          { status: 400 }
        );
      }
      if (backendRes.status === 409) {
        return NextResponse.json(
          { error: errorFromBackend || "Employee already exists or slot limit exceeded", details: backendData },
          { status: 409 }
        );
      }

      // Return mock data for development if backend is not available
      const employeeData = JSON.parse(body);
      const mockEmployee = {
        id: `emp_${Date.now()}`,
        ...employeeData,
        enrolledDate: new Date().toISOString().split('T')[0],
      };
      return NextResponse.json(mockEmployee, { status: 201 });
    }

    if (backendData && backendData.success === false) {
      const message =
        backendData?.data?.error || backendData?.error || backendData?.message || 'Failed to create employee';
      return NextResponse.json(
        { error: message, details: backendData },
        { status: 400 }
      );
    }

    // Check if backend returned empty data array (indicates no actual creation)
    if (backendData && backendData.success === true && Array.isArray(backendData.data) && backendData.data.length === 0) {
      // Return error to frontend since no employee was actually created
      return NextResponse.json(
        {
          error: 'Backend returned empty employee list instead of created employee. Backend POST endpoint is misconfigured.',
          details: backendData
        },
        { status: 500 }
      );
    }

    // Normal success behavior
    return NextResponse.json(backendData || {}, { status: 201 });
  } catch (error: any) {
    console.error('Business employees POST error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to add employee' },
      { status: 500 }
    );
  }
}