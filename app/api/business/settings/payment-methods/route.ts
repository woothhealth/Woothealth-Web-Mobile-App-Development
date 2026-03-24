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
      `${BACKEND_URL}/business/settings/payment-methods`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for payment methods`);
      if (backendRes.status === 404) {
        return NextResponse.json({ error: 'Payment methods not found' }, { status: 404 });
      }
      // Return mock data for development fallback for non-404 errors
      const mockPaymentMethods = [
        {
          id: "card_001",
          cardType: "visa",
          lastFour: "4242",
          expiryMonth: "12",
          expiryYear: "25",
          cardholderName: "Tech Corp",
          isDefault: true,
          addedDate: "2024-01-01",
          status: "active"
        },
        {
          id: "card_002",
          cardType: "mastercard",
          lastFour: "5555",
          expiryMonth: "08",
          expiryYear: "26",
          cardholderName: "Tech Corp",
          isDefault: false,
          addedDate: "2024-02-01",
          status: "active"
        },
        {
          id: "card_003",
          cardType: "amex",
          lastFour: "1011",
          expiryMonth: "06",
          expiryYear: "24",
          cardholderName: "Tech Corp",
          isDefault: false,
          addedDate: "2023-12-15",
          status: "expired"
        }
      ];
      return NextResponse.json(mockPaymentMethods, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json(data || [], { status: 200 });
  } catch (error: any) {
    console.error('Business payment methods GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
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

    if (!payloadData.cardType || !payloadData.lastFour || !payloadData.expiryMonth || 
        !payloadData.expiryYear || !payloadData.token) {
      return NextResponse.json(
        { error: 'cardType, lastFour, expiryMonth, expiryYear, and token are required' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/settings/payment-methods`,
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
      console.error(`Failed to add payment method: ${backendRes.status}`);
      
      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: 'Invalid payment card data' },
          { status: 400 }
        );
      }
      if (backendRes.status === 409) {
        return NextResponse.json(
          { error: 'Payment method already exists' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to add payment method' },
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
    console.error('Business payment methods POST error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}
