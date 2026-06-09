import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const planId = url.searchParams.get('planId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: [], message: 'Plans list retrieved (mock)' }, { status: 200 });
    }

    if (planId) {
      const backendRes = await fetch(`${BACKEND_URL}/admin/plans/${planId}`, {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: 'include',
        next: { revalidate: 300 },
      });
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/plans/`, {
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
      next: { revalidate: 300 },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin plans GET error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch admin plans' }, { status: 500 });
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
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { $id: Date.now().toString(), ...body }, message: 'Plan created (mock)' }, { status: 201 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/plans/`, {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    // read response as text first so we can log raw body on errors
    const text = await backendRes.text();
    let data: any = text;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // keep raw text if not JSON
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin plans POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to create plan' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const planId = url.searchParams.get('planId');
    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!planId) {
      return NextResponse.json({ success: false, error: 'planId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, data: { $id: planId, ...body }, message: 'Plan updated (mock)' }, { status: 200 });
    }

    // Ensure backend receives the planId in the body in case it expects it there
    const forwardBody = { ...(body || {}), planId };

    const backendRes = await fetch(`${BACKEND_URL}/admin/plans/${planId}`, {
      method: 'PUT',
      headers: {
        ...getAdminHeaders(cookieHeader),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(forwardBody),
      credentials: 'include',
    });

    const text = await backendRes.text();
    let data: any = text;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // keep raw text if not JSON
    }

    if (backendRes.status === 200 && data && typeof data === 'object' && data.success === false) {
      console.error('Admin plans PUT returned 200 but payload indicates failure', {
        status: backendRes.status,
        statusText: backendRes.statusText,
        requestBody: forwardBody,
        responseBody: data,
        responseText: text,
      });
    }

    if (!backendRes.ok) {
      console.error('Admin plans PUT failed', {
        status: backendRes.status,
        statusText: backendRes.statusText,
        requestBody: forwardBody,
        responseBody: data,
        responseText: text,
      });
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin plans PUT error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to update plan' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const planId = url.searchParams.get('planId');
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!planId) {
      return NextResponse.json({ success: false, error: 'planId is required' }, { status: 400 });
    }

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ success: true, message: 'Plan deleted (mock)' }, { status: 200 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/admin/plans/${planId}`, {
      method: 'DELETE',
      headers: {
        ...getAdminHeaders(cookieHeader),
      },
      credentials: 'include',
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error('Admin plans DELETE error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to delete plan' }, { status: 500 });
  }
}
