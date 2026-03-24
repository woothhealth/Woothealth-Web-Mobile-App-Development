import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/settings/sla`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for SLA documents`);
      if (backendRes.status === 404) {
        return NextResponse.json({ error: 'SLA documents not found' }, { status: 404 });
      }
      // Return mock data for development fallback for non-404 errors
      const mockSlas = [
        {
          id: "sla_001",
          fileName: "SLA_2024.pdf",
          fileUrl: "https://storage.example.com/sla_2024.pdf",
          fileSize: "2.4 MB",
          validUntil: "2024-12-31",
          uploadedDate: "2024-01-15",
          status: "active"
        },
        {
          id: "sla_002",
          fileName: "SLA_Amendment_2024.pdf",
          fileUrl: "https://storage.example.com/sla_amendment_2024.pdf",
          fileSize: "1.8 MB",
          validUntil: "2024-12-31",
          uploadedDate: "2024-02-01",
          status: "active"
        },
        {
          id: "sla_003",
          fileName: "SLA_2023.pdf",
          fileUrl: "https://storage.example.com/sla_2023.pdf",
          fileSize: "2.1 MB",
          validUntil: "2023-12-31",
          uploadedDate: "2023-01-15",
          status: "expired"
        }
      ];
      return NextResponse.json(mockSlas, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json(data || [], { status: 200 });
  } catch (error: any) {
    console.error('Business SLA GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch SLA documents' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    const body = await req.text();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    // Validate request body
    let payloadData;
    try {
      payloadData = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!payloadData.fileName || !payloadData.fileUrl || !payloadData.fileSize || !payloadData.validUntil) {
      return NextResponse.json(
        { error: 'fileName, fileUrl, fileSize, and validUntil are required' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/settings/sla`,
      {
        method: "POST",
        headers: {
          ...getBusinessHeaders(cookieHeader),
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: body,
      }
    );

    if (!backendRes.ok) {
      console.error(`Failed to register SLA document: ${backendRes.status}`);
      
      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: 'Invalid SLA document data' },
          { status: 400 }
        );
      }
      if (backendRes.status === 409) {
        return NextResponse.json(
          { error: 'SLA document already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to register SLA document' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 201 });
    }
    
    return NextResponse.json(data || {}, { status: 201 });
  } catch (error: any) {
    console.error('Business SLA POST error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to register SLA document' },
      { status: 500 }
    );
  }
}
