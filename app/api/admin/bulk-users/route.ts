import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Read incoming body as ArrayBuffer so we can forward binary/form data unchanged
    const buf = await req.arrayBuffer();
    const contentType = req.headers.get('content-type') || '';

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL for bulk-users');
      return NextResponse.json({ success: true, message: 'Bulk upload accepted (mock)' }, { status: 201 });
    }

    const backendRes = await fetch(BACKEND_URL + '/admin/bulk-users', {
      method: 'POST',
      headers: {
        ...getAdminHeaders(cookieHeader),
        ...(contentType ? { 'content-type': contentType } : {}),
      },
      body: buf,
      credentials: 'include',
    });

    const text = await backendRes.text();
    let data: any = text;
    try { data = JSON.parse(text); } catch (e) { /* not JSON */ }

    if (!backendRes.ok) {
      // console.error(`Backend bulk-users returned ${backendRes.status}`, text);
      return NextResponse.json({ success: false, error: 'Backend bulk upload failed', details: data }, { status: 500 });
    }

    return NextResponse.json(data || { success: true, message: 'Bulk upload successful' }, { status: backendRes.status || 200 });
  } catch (error: any) {
    // console.error('Admin bulk-users POST error:', error?.message || error);
    return NextResponse.json({ success: false, error: 'Failed to process bulk upload' }, { status: 500 });
  }
}
