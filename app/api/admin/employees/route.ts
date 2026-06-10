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

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], total: 0, message: 'No backend configured' }, { status: 200 });
    }

    const target = employeeId ? `${BACKEND_URL}/admin/employees/${employeeId}` : `${BACKEND_URL}/admin/employees/`;
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
    // console.error('Admin employees GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin employees' }, { status: 500 });
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
      return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body }, message: 'Employee created (mock)' }, { status: 201 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/employees/`, {
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
    // console.error('Admin employees POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!employeeId) {
      return NextResponse.json({ success: false, error: 'employeeId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: { id: employeeId, ...body }, message: 'Employee updated (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/employees/${employeeId}`, {
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
    // console.error('Admin employees PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const employeeId = url.searchParams.get('employeeId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!employeeId) {
      return NextResponse.json({ success: false, error: 'employeeId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, message: 'Employee deleted (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    // console.error('Admin employees DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete employee' }, { status: 500 });
  }
}
