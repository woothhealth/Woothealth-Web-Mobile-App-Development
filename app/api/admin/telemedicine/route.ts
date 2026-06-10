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

const buildBackendUrl = (
  base: string,
  id?: string,
  page?: string,
  limit?: string
) => {
  let target = id ? `${base}/admin/telemedicine/${id}` : `${base}/admin/telemedicine/`;
  const params = new URLSearchParams();

  if (!id) {
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
  }

  const queryString = params.toString();
  if (queryString) {
    target += `?${queryString}`;
  }

  return target;
};

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const telemedicineId = url.searchParams.get('id') || url.searchParams.get('telemedicineId');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], total: 0, message: 'Backend URL not configured' }, { status: 200 });
    }

    const target = buildBackendUrl(BACKEND_URL, telemedicineId ?? undefined, page, limit);
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
    // console.error('Admin telemedicine GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch telemedicine' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/telemedicine/`, {
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
    // console.error('Admin telemedicine POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create telemedicine' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const telemedicineId = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!telemedicineId) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/telemedicine/${telemedicineId}`, {
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
    // console.error('Admin telemedicine PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update telemedicine' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const telemedicineId = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!telemedicineId) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: false, error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/telemedicine/${telemedicineId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    // console.error('Admin telemedicine DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete telemedicine' }, { status: 500 });
  }
}