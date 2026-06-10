import { NextResponse } from 'next/server';
import { requireAdminRole, getAdminHeaders } from '@/lib/adminGuard';

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
  search?: string,
  status?: string,
  page?: string
) => {
  let target = id ? `${base}/admin/reimbursement/${id}` : `${base}/admin/reimbursement/`;
  const params = new URLSearchParams();

  if (!id) {
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (page) params.set('page', page);
  }

  const queryString = params.toString();
  if (queryString) {
    target += `?${queryString}`;
  }

  return target;
};

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const reimbursementId = url.searchParams.get('id');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const page = url.searchParams.get('page') || '1';
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], total: 0, message: 'Backend URL not configured' }, { status: 200 });
    }

    const target = buildBackendUrl(BACKEND_URL, reimbursementId ?? undefined, search, status, page);
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
    // console.error('Admin reimbursement GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reimbursements' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const reimbursementId = url.searchParams.get('id');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!reimbursementId) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: { id: reimbursementId, ...body }, message: 'Reimbursement updated (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/reimbursement/${reimbursementId}`, {
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
    // console.error('Admin reimbursement PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update reimbursement' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const reimbursementId = url.searchParams.get('id');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!reimbursementId) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, message: 'Reimbursement deleted (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/reimbursement/${reimbursementId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    // console.error('Admin reimbursement DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete reimbursement' }, { status: 500 });
  }
}
