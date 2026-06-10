import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL environment variable');
      // Return mock data for development
      const mockEmployees = [
        { id: '1', name: 'Amaka Okoro', department: 'Finance', role: 'Manager', email: 'amaka.okoro@example.com', phone: '+234 801 234 5678', status: 'Active' },
        { id: '2', name: 'Chris Nwosu', department: 'IT', role: 'Developer', email: 'chris.nwosu@example.com', phone: '+234 802 345 6789', status: 'Active' },
        { id: '3', name: 'Sade Bello', department: 'HR', role: 'Recruiter', email: 'sade.bello@example.com', phone: '+234 803 456 7890', status: 'Inactive' },
      ];

      if (employeeId) {
        const emp = mockEmployees.find(e => e.id === employeeId);
        if (!emp) {
          return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: emp, message: "Employee retrieved (mock)" }, { status: 200 });
      }

      return NextResponse.json({ success: true, data: mockEmployees, total: mockEmployees.length, message: "Employees list retrieved (mock)" }, { status: 200 });
    }

    // Try backend first
    if (employeeId) {
      try {
        const backendRes = await fetch(BACKEND_URL + "/admin/employee/" + employeeId, {
          headers: {
            ...getAdminHeaders(cookieHeader),
          },
          credentials: "include",
          next: { revalidate: 300 },
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
        } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    } else {
      try {
        const backendRes = await fetch(BACKEND_URL + "/admin/employee/", {
          headers: {
            ...getAdminHeaders(cookieHeader),
          },
          credentials: "include",
          next: { revalidate: 300 },
        });

        if (backendRes.ok) {
          const data = await backendRes.json();
          if (data && typeof data === "object" && data.success && data.data) {
            return NextResponse.json(data, { status: 200 });
          }
          return NextResponse.json(data || { success: true, data: [], total: 0 }, { status: 200 });
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    }

    // Fallback to mock data
    const mockEmployees = [
      { id: '1', name: 'Amaka Okoro', department: 'Finance', role: 'Manager', email: 'amaka.okoro@example.com', phone: '+234 801 234 5678', status: 'Active' },
      { id: '2', name: 'Chris Nwosu', department: 'IT', role: 'Developer', email: 'chris.nwosu@example.com', phone: '+234 802 345 6789', status: 'Active' },
      { id: '3', name: 'Sade Bello', department: 'HR', role: 'Recruiter', email: 'sade.bello@example.com', phone: '+234 803 456 7890', status: 'Inactive' },
    ];

    if (employeeId) {
      const emp = mockEmployees.find(e => e.id === employeeId);
      if (!emp) {
        return NextResponse.json({ error: "Employee not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: emp, message: "Employee retrieved (mock)" }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: mockEmployees, total: mockEmployees.length, message: "Employees list retrieved (mock)" }, { status: 200 });
    } catch (error: any) {
    // console.error('Admin employees GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin employees' }, { status: 500 });
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
      // console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body }, message: "Employee created (mock)" }, { status: 201 });
    }

    const backendRes = await fetch(BACKEND_URL + "/admin/employee/", {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin employee POST`);
    }

    const data = await backendRes.json();
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    // console.error('Admin employee POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const body = await req.json();

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL environment variable');
      // Mock update
      return NextResponse.json({ success: true, data: { id: employeeId || Date.now().toString(), ...body }, message: 'Employee updated (mock)' }, { status: 200 });
    }

    const target = employeeId ? `/admin/employee/${employeeId}` : `/admin/employee/`;
    const backendRes = await fetch(BACKEND_URL + target, {
      method: 'PUT',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await backendRes.json();
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }
    return NextResponse.json(data || { success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    // console.error('Admin employee PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, message: 'Employee deleted (mock)' }, { status: 200 });
    }

    if (!employeeId) {
      return NextResponse.json({ success: false, error: 'employeeId required' }, { status: 400 });
    }

    const backendRes = await fetch(BACKEND_URL + "/admin/employee/" + employeeId, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: "include",
    });

    if (!backendRes.ok) {
      // console.warn(`Backend returned ${backendRes.status} for admin employee DELETE`);
    }

    const data = await backendRes.json();
    return NextResponse.json(data || { success: true }, { status: 200 });
  } catch (error: any) {
    // console.error('Admin employee DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete employee' }, { status: 500 });
  }
}
