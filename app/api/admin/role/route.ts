import { NextResponse } from 'next/server';
import { requireAdminRole, getAdminHeaders } from '@/lib/adminGuard';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id') || undefined;
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL for admin role proxy');
      const mock = [
        { id: 'role-1', name: 'Superadmin', description: 'Full access', totalUsers: 1, users: [], moduleAccess: [], createdAt: new Date().toISOString() },
        { id: 'role-2', name: 'Admin', description: 'Admin access', totalUsers: 2, users: [], moduleAccess: [], createdAt: new Date().toISOString() },
      ];
      if (id) {
        const found = mock.find((r) => r.id === id || r.name === id);
        if (!found) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: found }, { status: 200 });
      }
      const start = (Number(page) - 1) * Number(limit);
      const paginated = mock.slice(start, start + Number(limit));
      return NextResponse.json({ success: true, data: paginated, total: mock.length }, { status: 200 });
    }

    const endpoint = id ? `/admin/roles/${id}` : `/admin/roles/`;
    const backendRes = await fetch(BACKEND_URL + endpoint + (id ? '' : `?page=${page}&limit=${limit}`), {
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
      next: { revalidate: 300 },
    });

    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend admin roles GET failed', backendRes.status, String(raw).slice(0, 1000));
    }

    // Normalize envelope responses
    if (data && typeof data === 'object' && data.success && data.data) {
      return NextResponse.json({ success: true, data: data.data, total: data.total || data.data.length }, { status: backendRes.status });
    }
    if (Array.isArray(data)) return NextResponse.json({ success: true, data, total: data.length }, { status: backendRes.status });
    return NextResponse.json(data || { success: true, data: [] }, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Admin role GET error:', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to fetch roles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/roles/`, {
      method: 'POST',
      headers: { ...getAdminHeaders(cookieHeader), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend admin roles POST failed', backendRes.status, String(raw).slice(0, 1000));
    }
    return NextResponse.json(data || {}, { status: backendRes.status || 200 });
  } catch (err: any) {
    // console.error('Admin role POST error:', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to create role' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/roles/${id}`, {
      method: 'POST',
      headers: { ...getAdminHeaders(cookieHeader), 'Content-Type': 'application/json', 'X-HTTP-Method-Override': 'PUT' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend admin roles PUT failed', backendRes.status, String(raw).slice(0, 1000));
    }
    return NextResponse.json(data || {}, { status: backendRes.status || 200 });
  } catch (err: any) {
    // console.error('Admin role PUT error:', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to update role' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/roles/${id}`, {
      method: 'DELETE',
      headers: { ...getAdminHeaders(cookieHeader) },
      credentials: 'include',
    });

    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend admin roles DELETE failed', backendRes.status, String(raw).slice(0, 1000));
    }
    return NextResponse.json(data || {}, { status: backendRes.status || 200 });
  } catch (err: any) {
    // console.error('Admin role DELETE error:', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to delete role' }, { status: 500 });
  }
}