import { NextResponse } from 'next/server';

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const buildBackendUrl = (base: string, id?: string, page?: string, limit?: string) => {
  let target = id ? `${base}/provider/profile/${id}` : `${base}/provider/profile/`;
  const params = new URLSearchParams();
  if (!id) {
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
  }
  const qs = params.toString();
  if (qs) target += `?${qs}`;
  return target;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id') || undefined;
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], message: 'Backend URL not configured' }, { status: 200 });
    }

    const target = buildBackendUrl(BACKEND_URL, id, page, limit);
    // forward cookie if present so backend can authenticate
    const headers: Record<string, string> = {};
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const backendRes = await fetch(target, {
      headers,
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Provider profile GET error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to fetch provider profiles' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const backendRes = await fetch(`${BACKEND_URL}/provider/profile/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Provider profile POST error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to create provider profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const backendRes = await fetch(`${BACKEND_URL}/provider/profile/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Provider profile PUT error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to update provider profile' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const cookieHeader = req.headers.get('cookie');
    const headers: Record<string, string> = {};
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const backendRes = await fetch(`${BACKEND_URL}/provider/profile/${id}`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    // console.error('Provider profile DELETE error', err?.message || err);
    return NextResponse.json({ success: false, error: 'Failed to delete provider profile' }, { status: 500 });
  }
}
