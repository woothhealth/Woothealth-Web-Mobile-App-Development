import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const buildBackendUrl = (base: string, id?: string, page?: string, limit?: string) => {
  let target = id ? `${base}/admin/pre-employment-tests/${id}` : `${base}/admin/pre-employment-tests/`;
  const params = new URLSearchParams();

  if (!id) {
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
  }

  const queryString = params.toString();
  if (queryString) target += `?${queryString}`;
  return target;
};

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id') || url.searchParams.get('preEmploymentId');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], total: 0, message: 'Backend URL not configured' }, { status: 200 });
    }

    const target = buildBackendUrl(BACKEND_URL, id ?? undefined, page, limit);
    const backendRes = await fetch(target, {
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
      next: { revalidate: 300 },
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin pre-employment GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch pre-employment tests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/pre-employment-tests/`, {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin pre-employment POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create pre-employment test' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/pre-employment-tests/${id}`, {
      method: 'PUT',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin pre-employment PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update pre-employment test' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    if (!BACKEND_URL) return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });

    const backendRes = await fetch(`${BACKEND_URL}/admin/pre-employment-tests/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin pre-employment DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete pre-employment test' }, { status: 500 });
  }
}
