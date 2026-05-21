import { NextResponse } from 'next/server';
import { buildBackendUrl, getForwardedHeaders, parseRawResponse } from '@/lib/notificationsProxy';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const url = new URL(req.url);
    const id = url.searchParams.get('id') || undefined;
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) return NextResponse.json({ success: true, data: [], message: 'Backend URL not configured' }, { status: 200 });

    const target = buildBackendUrl(BACKEND_URL, { admin: false, id, page, limit });
    const forwarded = getForwardedHeaders(cookieHeader, false);
    const backendRes = await fetch(target, {
      headers: forwarded,
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) console.error('Backend notifications GET failed', backendRes.status, String(raw).slice(0, 1000));

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('Notifications GET error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/notifications/`, {
      method: 'POST',
      headers: { ...getForwardedHeaders(cookieHeader, false), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) console.error('Backend notifications POST failed', backendRes.status, String(raw).slice(0, 1000));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('Notifications POST error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/notifications/${id}`, {
      method: 'POST',
      headers: { ...getForwardedHeaders(cookieHeader, false), 'Content-Type': 'application/json', 'X-HTTP-Method-Override': 'PUT' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) console.error('Backend notifications PUT failed', backendRes.status, String(raw).slice(0, 1000));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('Notifications PUT error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: { ...getForwardedHeaders(cookieHeader, false) },
      credentials: 'include',
    });
    const raw = await backendRes.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { data = raw; }
    if (!backendRes.ok) console.error('Backend notifications DELETE failed', backendRes.status, String(raw).slice(0, 1000));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('Notifications DELETE error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to delete notification' }, { status: 500 });
  }
}
