import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    // Debug: log incoming request
    // eslint-disable-next-line no-console
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
        const client = mockClients.find(c => c.userId === clientId);
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
          // Debug: backend response for GET single
          // eslint-disable-next-line no-console
          console.debug('ADMIN API GET backend data (single):', data);
          return NextResponse.json(data);
        } else {
          // eslint-disable-next-line no-console
          console.warn('ADMIN API GET backend non-ok response (single):', backendRes.status);
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
          // Debug: backend response for GET list
          // eslint-disable-next-line no-console
          // console.debug('ADMIN API GET backend data (list):', data);
          if (data && typeof data === "object" && data.success && data.data) {
            return NextResponse.json(data, { status: 200 });
          }
          return NextResponse.json(data || { success: true, data: [], total: 0 }, { status: 200 });
        } else {
          // eslint-disable-next-line no-console
          console.warn('ADMIN API GET backend non-ok response (list):', backendRes.status);
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    }

    // Fallback to mock data
    const { mockClients } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/clients/mock-clients');

    if (clientId) {
      const client = mockClients.find(c => c.userId === clientId);
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
    // Debug: incoming POST request
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    // request body parsed
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body }, message: "Client created (mock)" }, { status: 201 });
    }

    // Call backend and handle network/fetch errors explicitly
    let backendRes: Response | null = null;
    try {
      backendRes = await fetch(BACKEND_URL + "/admin/clients/", {
        method: 'POST',
        headers: {
          ...getAdminHeaders(cookieHeader),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: "include",
      });
    } catch (fetchError: any) {
      // Log and return a clear error to the client so UI can show the reason
      // eslint-disable-next-line no-console
      console.error('ADMIN API POST backend fetch failed:', fetchError?.message || fetchError, { code: fetchError?.code || fetchError?.cause?.code });
      const details = fetchError?.message || String(fetchError);
      return NextResponse.json({ success: false, error: 'Failed to contact backend service', details, code: fetchError?.code || fetchError?.cause?.code || null }, { status: 502 });
    }

    if (!backendRes.ok) {
      // eslint-disable-next-line no-console
      console.warn(`ADMIN API POST backend returned ${backendRes.status} for admin clients POST`);
    }

    // attempt to parse JSON; fall back to text
    let data: any;
    try {
      data = await backendRes.json();
    } catch (parseErr) {
      const text = await backendRes.text();
      data = text;
    }

    // Debug: backend response to POST

    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [] }, { status: backendRes.status || 200 });
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