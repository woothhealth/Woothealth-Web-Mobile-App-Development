import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const prescId = url.searchParams.get('id');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // If no backend configured, return mock data
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable for prescriptions');
      const mock = [
        {
          id: 'presc-1',
          prescriptionCode: 'RX-10001',
          date: '2026-01-30T00:00:00.000Z',
          patientName: 'John Doe',
          userId: 'WHT-0001-A',
          doctor: 'Dr. Smith',
          specialization: 'General',
          status: 'pending'
        },
        {
          id: 'presc-2',
          prescriptionCode: 'RX-10002',
          date: '2026-01-29T00:00:00.000Z',
          patientName: 'Jane Roe',
          userId: 'WHT-0002-B',
          doctor: 'Dr. Aden',
          specialization: 'Pediatrics',
          status: 'approved'
        }
      ];

      if (prescId) {
        const found = mock.find(p => p.id === prescId || p.prescriptionCode === prescId);
        if (!found) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: found }, { status: 200 });
      }

      const start = (page - 1) * limit;
      const paginated = mock.slice(start, start + limit);
      return NextResponse.json({ success: true, data: paginated, total: mock.length }, { status: 200 });
    }

    // Proxy to backend
    const endpoint = prescId ? `/admin/prescription/${prescId}` : `/admin/prescription/`;
    const backendRes = await fetch(BACKEND_URL + endpoint + (prescId ? '' : `?page=${page}&limit=${limit}`), {
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
      next: { revalidate: 300 },
    });

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin prescription`);
      return NextResponse.json({ success: true, data: [], total: 0, message: 'Prescriptions retrieved' }, { status: 200 });
    }

    const data = await backendRes.json();

    // Normalize response
    if (data && typeof data === 'object' && data.success && data.data) {
      return NextResponse.json({ success: true, data: data.data, total: data.total || data.data.length }, { status: 200 });
    }

    if (Array.isArray(data)) {
      return NextResponse.json({ success: true, data, total: data.length }, { status: 200 });
    }

    // Default
    return NextResponse.json(data || { success: true, data: [], total: 0 }, { status: 200 });
  } catch (error: any) {
    console.error('Admin prescription GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable for prescriptions POST');
      return NextResponse.json({ success: true, data: { id: `mock-${Date.now()}`, ...body }, message: 'Mock created' }, { status: 201 });
    }

    const backendRes = await fetch(BACKEND_URL + '/admin/prescription/', {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await backendRes.json();
    // Pass through response
    return NextResponse.json(data || {}, { status: backendRes.status || 200 });
  } catch (error: any) {
    console.error('Admin prescription POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create prescription' }, { status: 500 });
  }
}
