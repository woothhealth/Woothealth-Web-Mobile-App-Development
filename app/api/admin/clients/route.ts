import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      // Return mock data for development
      if (clientId) {
        const { mockClients } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/clients/mock-clients');
        const client = mockClients.find(c => c.id === clientId);
        if (!client) {
          return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: client, message: "Client retrieved (mock)" }, { status: 200 });
      }

      const { mockClients } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/clients/mock-clients');
      return NextResponse.json({ success: true, data: mockClients, total: mockClients.length, message: "Clients list retrieved (mock)" }, { status: 200 });
    }

    // Try backend first
    if (clientId) {
      try {
        const backendRes = await fetch(BACKEND_URL + "/admin/clients/" + clientId, {
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
        const backendRes = await fetch(BACKEND_URL + "/admin/clients/", {
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
    const { mockClients } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/clients/mock-clients');

    if (clientId) {
      const client = mockClients.find(c => c.id === clientId);
      if (!client) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: client, message: "Client retrieved (mock)" }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: mockClients, total: mockClients.length, message: "Clients list retrieved (mock)" }, { status: 200 });
  } catch (error: any) {
    console.error('Admin clients GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin clients' }, { status: 500 });
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
      return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body }, message: "Client created (mock)" }, { status: 201 });
    }

    const backendRes = await fetch(BACKEND_URL + "/admin/clients/", {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin clients POST`);
    }

    const data = await backendRes.json();
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    console.error('Admin clients POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create client' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');
    const body = await req.json();

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      // Mock update
      return NextResponse.json({ success: true, data: { id: clientId || Date.now().toString(), ...body }, message: 'Client updated (mock)' }, { status: 200 });
    }

    const target = clientId ? `/admin/clients/${clientId}` : `/admin/clients/`;
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
    console.error('Admin clients PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update client' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const clientId = url.searchParams.get('clientId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, message: 'Client deleted (mock)' }, { status: 200 });
    }

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId required' }, { status: 400 });
    }

    const backendRes = await fetch(BACKEND_URL + "/admin/clients/" + clientId, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: "include",
    });

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin clients DELETE`);
    }

    const data = await backendRes.json();
    return NextResponse.json(data || { success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Admin clients DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete client' }, { status: 500 });
  }
}
