import { NextResponse } from 'next/server';

const parseJson = async (res: Response) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const target = `${BACKEND_URL}/provider/claims`;

    const backendRes = await fetch(target, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('pr/claims POST proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr claims POST' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    // forward query string if present
    const url = new URL(req.url);
    const qs = url.search ? `?${url.searchParams.toString()}` : '';
    const target = `${BACKEND_URL}/provider/claims${qs}`;

    const backendRes = await fetch(target, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const text = await backendRes.text();
    try { return NextResponse.json(JSON.parse(text), { status: backendRes.status }); } catch { return NextResponse.json({ data: text }, { status: backendRes.status }); }
  } catch (err: any) {
    console.error('pr/claims GET proxy error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to proxy pr claims GET' }, { status: 500 });
  }
}
