import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const enrolleeId = url.searchParams.get('enrolleeId');
    const businessId = url.searchParams.get('businessId');
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || url.searchParams.get('view') || '10');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // ADMIN ENROLLEES GET called

    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      // Return mock data for development
      if (enrolleeId) {
        const { mockEnrollees } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/enrollees/mockEnrollees');
        const enrollee = mockEnrollees.find(e => e.id === enrolleeId);
        if (!enrollee) {
          return NextResponse.json({ error: "Enrollee not found" }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          data: enrollee,
          message: "Enrollee retrieved"
        }, { status: 200 });
      }
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: "Enrollees list retrieved"
      }, { status: 200 });
    }

    // Try backend first
        if (enrolleeId) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/enrollees/" + enrolleeId,
          {
            headers: {
              ...getAdminHeaders(cookieHeader),
            },
            credentials: "include",
            next: { revalidate: 300 },
          }
        );

        let backendBody: any = null;
        try {
          backendBody = await backendRes.clone().json();
        } catch (err) {
          console.warn('ADMIN ENROLLEES: failed to parse backend JSON for single enrollee', err);
        }

        // ADMIN ENROLLEES backend single response

        if (backendRes.ok) {
          const data = backendBody ?? null;
          try {
            const payload = data?.data ?? data;
            const sample = Array.isArray(payload) ? payload.slice(0, 10) : [payload];
            console.debug('admin/enrollees GET backend returned single enrollee', { page, limit, sample });
          } catch (e) {
            console.debug('admin/enrollees GET backend returned non-iterable data', { page, limit, data });
          }
          return NextResponse.json(data);
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
        console.warn('ADMIN ENROLLEES: backend request error for single enrollee', String(backendError));
      }
    } else {
      try {
        const listUrl = new URL(BACKEND_URL + "/admin/enrollees/");
        if (businessId) listUrl.searchParams.set('businessId', businessId);
        if (search) listUrl.searchParams.set('search', search);
        if (page) listUrl.searchParams.set('page', String(page));
        if (limit) listUrl.searchParams.set('limit', String(limit));

        const backendRes = await fetch(
          listUrl.toString(),
          {
            headers: {
              ...getAdminHeaders(cookieHeader),
            },
            credentials: "include",
            next: { revalidate: 300 }, // Cache for 5 minutes
          }
        );

        let backendBody: any = null;
        try {
          backendBody = await backendRes.clone().json();
        } catch (err) {
          console.warn('ADMIN ENROLLEES: failed to parse backend JSON for list', err);
        }

        // ADMIN ENROLLEES backend list response

        if (backendRes.ok) {
          const data = backendBody ?? null;
          try {
            const payload = data?.data ?? data;
            const sample = Array.isArray(payload) ? payload.slice(0, 10) : [payload];
            console.debug('admin/enrollees GET backend returned enrollees', { page, limit, sample });
          } catch (e) {
            console.debug('admin/enrollees GET backend returned non-iterable data', { page, limit, data });
          }

          // Normalize response if wrapped in envelope
          if (data && typeof data === "object" && data.success && data.data) {
            return NextResponse.json(data, { status: 200 });
          }

          return NextResponse.json(data || { success: true, data: [], total: 0 }, { status: 200 });
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
        console.warn('ADMIN ENROLLEES: backend request error for list', String(backendError));
      }
    }

    // Fallback to mock data
    const { mockEnrollees } = await import('@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/enrollees/mockEnrollees');

    // ADMIN ENROLLEES: using mock data
    if (enrolleeId) {
      const enrollee = mockEnrollees.find(e => e.id === enrolleeId);
      if (!enrollee) {
        return NextResponse.json({ error: "Enrollee not found" }, { status: 404 });
      }
      try {
        const sample = [enrollee];
        console.debug('admin/enrollees GET mock returning single enrollee', { page, limit, sample });
      } catch (e) {
        console.debug('admin/enrollees GET mock returning data', { page, limit, enrollee });
      }
      return NextResponse.json({
        success: true,
        data: enrollee,
        message: "Enrollee retrieved (mock)"
      }, { status: 200 });
    }

    try {
      const payload = businessId ? mockEnrollees.filter(e => String(e.businessId) === String(businessId)) : mockEnrollees;
      const sample = payload.slice(0, 10);
      console.debug('admin/enrollees GET mock returning enrollees', { page, limit, businessId, sample });
      return NextResponse.json({
        success: true,
        data: payload,
        total: payload.length,
        message: "Enrollees list retrieved (mock)"
      }, { status: 200 });
    } catch (e) {
      console.debug('admin/enrollees GET mock returning data', { page, limit, businessId, mockEnrollees });
      return NextResponse.json({ success: true, data: [], total: 0, message: 'Enrollees list retrieved (mock)' }, { status: 200 });
    }
  } catch (error: any) {
    console.error('Admin enrollees GET error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin enrollees' },
      { status: 500 }
    );
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
      // Return mock success for development
      return NextResponse.json({
        success: true,
        data: { id: Date.now(), ...body },
        message: "Enrollee added successfully"
      }, { status: 201 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/admin/enrollees/",
      {
        method: 'POST',
        headers: {
          ...getAdminHeaders(cookieHeader),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for admin enrollees POST`);
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    console.error('Admin enrollees POST error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update admin enrollee' },
      { status: 500 }
    );
  }
}