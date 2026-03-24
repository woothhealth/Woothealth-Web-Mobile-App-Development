import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || '';
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/billings${type ? `?type=${type}` : ''}`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for billings list`);
      // Return mock data for development if backend is not available
      const mockBillings = [
        {
          id: "inv_001",
          type: "debit",
          amount: 150000,
          status: "paid",
          date: "2024-01-15",
          description: "Monthly Premium - Quantum Plan",
          dueDate: "2024-01-15",
          paidDate: "2024-01-15"
        },
        {
          id: "inv_002",
          type: "credit",
          amount: -50000,
          status: "processed",
          date: "2024-01-20",
          description: "Reimbursement - Hospital Visit",
          dueDate: null,
          paidDate: "2024-01-20"
        },
        {
          id: "inv_003",
          type: "debit",
          amount: 75000,
          status: "pending",
          date: "2024-02-01",
          description: "Monthly Premium - Quantum Plan",
          dueDate: "2024-02-15",
          paidDate: null
        }
      ];

      // Filter by type if provided
      const filteredBillings = type ? mockBillings.filter(billing => billing.type === type) : mockBillings;
      return NextResponse.json(filteredBillings, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json(data || [], { status: 200 });
  } catch (error: any) {
    console.error('Business billings GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch billings' },
      { status: 500 }
    );
  }
}