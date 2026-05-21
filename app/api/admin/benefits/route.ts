import { NextResponse } from 'next/server';
import { requireAdminRole, getAdminHeaders } from '@/lib/adminGuard';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const benefitId = url.searchParams.get('benefitId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: [], message: 'Benefits list retrieved (mock)' }, { status: 200 });
    }

    if (benefitId) {
      const backendRes = await fetch(`${BACKEND_URL}/admin/benefits/${benefitId}`, {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: 'include',
        next: { revalidate: 300 },
      });
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/benefits/`, {
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
      next: { revalidate: 300 },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin benefits GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin benefits' }, { status: 500 });
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
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { $id: Date.now().toString(), ...body }, message: 'Benefit created (mock)' }, { status: 201 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/benefits/`, {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin benefits POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create benefit' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const benefitId = url.searchParams.get('benefitId');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!benefitId) {
      return NextResponse.json({ success: false, error: 'benefitId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { $id: benefitId, ...body }, message: 'Benefit updated (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/benefits/${benefitId}`, {
      method: 'PUT',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin benefits PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update benefit' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const benefitId = url.searchParams.get('benefitId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!benefitId) {
      return NextResponse.json({ success: false, error: 'benefitId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, message: 'Benefit deleted (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/benefits/${benefitId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin benefits DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete benefit' }, { status: 500 });
  }
}
