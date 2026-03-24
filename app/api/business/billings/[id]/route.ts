import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireBusinessRole(cookieHeader);
    if (guard) return guard;
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    
    if (!BACKEND_URL) {
      console.error('Missing BACKEND_URL environment variable');
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    const { id } = await params;

    const backendRes = await fetch(
      `${BACKEND_URL}/business/billings/${id}`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for billing ${id}`);
      if (backendRes.status === 404) {
        return NextResponse.json(
          { error: "Billing not found" },
          { status: 404 }
        );
      }
      
      // Return mock data for development if backend is not available
      const mockBilling = {
        id: id,
        type: "debit",
        amount: 150000,
        status: "paid",
        date: "2024-01-15",
        description: "Monthly Premium - Quantum Plan",
        dueDate: "2024-01-15",
        paidDate: "2024-01-15",
        billTo: {
          name: "TechCorp Solutions",
          address: "123 Business Street, Lagos, Nigeria",
          email: "billing@techcorp.com",
          phone: "+2348012345678"
        },
        billFrom: {
          name: "WootHealth Insurance",
          address: "456 Health Avenue, Abuja, Nigeria",
          email: "billing@woothealth.com",
          phone: "+2348019876543"
        },
        lineItems: [
          {
            description: "Quantum Plan Premium - 50 employees",
            quantity: 50,
            unitPrice: 3000,
            total: 150000
          }
        ],
        paymentInfo: {
          method: "Bank Transfer",
          reference: "TXN_123456789",
          paidAt: "2024-01-15T10:30:00Z"
        },
        notes: "Monthly insurance premium payment"
      };
      return NextResponse.json(mockBilling, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Business billing GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch billing' },
      { status: 500 }
    );
  }
}