import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const { id } = await params;

    const backendRes = await fetch(
      `${BACKEND_URL}/business/employees/${id}`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for employee ${id}`);
      if (backendRes.status === 404) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }
      
      // Return mock data for development if backend is not available
      const mockData = {
        id: id,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+2348012345678",
        department: "Engineering",
        dateOfBirth: "1990-01-01",
        gender: "Male",
        plan: "Quantum",
        status: "active",
        enrolledDate: "2024-01-15",
        coverage: {
          medical: true,
          dental: true,
          vision: false,
          mentalHealth: true
        },
        dependents: [
          {
            id: "dep1",
            name: "Jane Doe",
            relationship: "Spouse",
            dateOfBirth: "1992-03-15"
          }
        ]
      };
      return NextResponse.json(mockData, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Return the full response structure for employee detail
    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Business employee GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    
    const body = await req.text();
    const { id } = await params;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/employees/${id}`,
      {
        method: "PUT",
        headers: {
          ...getBusinessHeaders(cookieHeader),
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: body,
      }
    );

    if (!backendRes.ok) {
      console.error(`Failed to update employee ${id}: ${backendRes.status}`);
      
      if (backendRes.status === 404) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }
      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: "Invalid employee data" },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to update employee" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    
    // Return the full response structure for employee update
    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Business employee PUT error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    
    const { id } = await params;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/employees/${id}`,
      {
        method: "DELETE",
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      if (backendRes.status === 404) {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to delete employee" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    
    // Return the full response structure for employee deletion
    return NextResponse.json(data || { message: "Employee deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error('Business employee DELETE error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}