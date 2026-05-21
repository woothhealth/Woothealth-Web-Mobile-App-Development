import { NextResponse } from 'next/server';
import { requireAdminRole, getAdminHeaders } from '@/lib/adminGuard';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const invoiceId = url.searchParams.get('invoiceId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      const { mockInvoices } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/finance/mock-finance');
      if (invoiceId) {
        const invoice = mockInvoices.find((item) => item.id === invoiceId);
        if (!invoice) {
          return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: invoice, message: 'Invoice retrieved (mock)' }, { status: 200 });
      }
      return NextResponse.json({ success: true, data: mockInvoices, total: mockInvoices.length, message: 'Finance list retrieved (mock)' }, { status: 200 });
    }

    if (invoiceId) {
      const backendRes = await fetch(`${BACKEND_URL}/admin/finance/${invoiceId}`, {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: 'include',
        next: { revalidate: 300 },
      });
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/finance/`, {
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
      next: { revalidate: 300 },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin finance GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin finance' }, { status: 500 });
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
      return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body }, message: 'Invoice created (mock)' }, { status: 201 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/finance/`, {
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
    console.error('Admin finance POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const invoiceId = url.searchParams.get('invoiceId');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!invoiceId) {
      return NextResponse.json({ success: false, error: 'invoiceId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { id: invoiceId, ...body }, message: 'Invoice updated (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/finance/${invoiceId}`, {
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
    console.error('Admin finance PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const invoiceId = url.searchParams.get('invoiceId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!invoiceId) {
      return NextResponse.json({ success: false, error: 'invoiceId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, message: 'Invoice deleted (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/finance/${invoiceId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin finance DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete invoice' }, { status: 500 });
  }
}
