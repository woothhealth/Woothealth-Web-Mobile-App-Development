import { NextResponse } from 'next/server';
import { getAdminHeaders, requireAdminRole } from '@/lib/adminGuard';
import { buildBackendUrl, getForwardedHeaders, mapItemsForAdmin, parseRawResponse } from '@/lib/notificationsProxy';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) {
      // console.error('Admin notifications GET guard failed: missing/invalid session or role');
      return guard;
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id') || undefined;
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], message: 'Backend URL not configured' }, { status: 200 });
    }

    const target = buildBackendUrl(BACKEND_URL, { admin: true, id, page, limit });
    const forwarded = getForwardedHeaders(cookieHeader, true);
    const backendRes = await fetch(target, {
      headers: forwarded,
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend notifications GET failed', backendRes.status, String(raw).slice(0, 1000));
    }

    // Normalize/transform notifications for admin consumers while preserving original payload
    const makeAdminTitle = (n: any) => {
      const type = (n.notificationType || n.type || '').toString().toLowerCase();
      const msg = (n.message || n.originalMessage || '').toString();
      if (type.includes('push') && /session|appointment|appointment request/i.test(msg)) {
        return `${n.userId ?? 'Unknown'} · New session request`;
      }
      if (/pre-?employment|test/i.test(msg)) return `${n.userId ?? 'Unknown'} · Pre-employment test`;
      if (n.title) return n.title;
      return msg ? (msg.length > 80 ? msg.slice(0, 77) + '...' : msg) : 'Notification';
    };

    if (Array.isArray(data)) {
      data = mapItemsForAdmin(data);
    } else if (data && Array.isArray((data as any).data)) {
      data.data = mapItemsForAdmin((data as any).data);
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Admin notifications GET error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) {
      // console.error('Admin notifications POST guard failed: missing/invalid session or role');
      return guard;
    }

    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/notifications/`, {
      method: 'POST',
      headers: { ...getAdminHeaders(cookieHeader), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend notifications POST failed', backendRes.status, String(raw).slice(0, 1000));
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Admin notifications POST error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) {
      // console.error('Admin notifications PUT guard failed: missing/invalid session or role');
      return guard;
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    // Some backends reject PUT on this route. Forward as POST with method override.
    const backendRes = await fetch(`${BACKEND_URL}/admin/notifications/${id}`, {
      method: 'POST',
      headers: { ...getAdminHeaders(cookieHeader), 'Content-Type': 'application/json', 'X-HTTP-Method-Override': 'PUT' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend notifications PUT failed', backendRes.status, String(raw).slice(0, 1000));
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Admin notifications PUT error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) {
      // console.error('Admin notifications DELETE guard failed: missing/invalid session or role');
      return guard;
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/notifications/${id}`, {
      method: 'DELETE',
      headers: { ...getAdminHeaders(cookieHeader) },
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) {
      // console.error('Backend notifications DELETE failed', backendRes.status, String(raw).slice(0, 1000));
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Admin notifications DELETE error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to delete notification' }, { status: 500 });
  }
}
