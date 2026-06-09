import { NextResponse } from 'next/server';
import { requireAdminRole, getAdminHeaders } from '@/lib/adminGuard';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL for admin tariff GET');
      const mock: any[] = [];
      console.log('Admin tariff GET (mock) - first 10 items:', mock.slice(0, 10));
      return NextResponse.json({ success: true, data: mock }, { status: 200 });
    }

    const url = new URL(req.url);
    const qs = url.search || '';
    const backendUrl = BACKEND_URL + '/admin/tariffs' + qs;

    const backendRes = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });

    const data = await backendRes.json().catch(async () => {
      const text = await backendRes.text();
      return { text };
    });

    // Determine array of items to log (support different response shapes)
    let items: any[] = [];
    if (Array.isArray(data)) items = data;
    else if (data && Array.isArray((data as any).data)) items = (data as any).data;

    console.log('Admin tariff GET - first 10 items:', items.slice(0, 10));

    if (!backendRes.ok) {
      console.error('Backend admin/tariffs GET failed', backendRes.status, data);
      return NextResponse.json({ success: false, error: data }, { status: 500 });
    }

    return NextResponse.json(data || { success: true }, { status: backendRes.status || 200 });
  } catch (error: any) {
    console.error('Admin tariff GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tariffs' }, { status: 500 });
  }
}
