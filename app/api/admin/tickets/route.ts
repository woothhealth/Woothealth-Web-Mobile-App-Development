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
    const ticketId = url.searchParams.get('ticketId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: [], total: 0, message: 'No backend configured' }, { status: 200 });
    }

    const target = ticketId ? `${BACKEND_URL}/admin/tickets/${ticketId}` : `${BACKEND_URL}/admin/tickets/`;
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
    // console.error('Admin tickets GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin tickets' }, { status: 500 });
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
      return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body }, message: 'Ticket created (mock)' }, { status: 201 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/tickets/`, {
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
    // console.error('Admin tickets POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const ticketId = url.searchParams.get('ticketId');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'ticketId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, data: { id: ticketId, ...body }, message: 'Ticket updated (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/tickets/${ticketId}`, {
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
    // console.error('Admin tickets PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const ticketId = url.searchParams.get('ticketId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'ticketId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      return NextResponse.json({ success: true, message: 'Ticket deleted (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });

    const data = await parseJson(backendRes);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    // console.error('Admin tickets DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete ticket' }, { status: 500 });
  }
}
