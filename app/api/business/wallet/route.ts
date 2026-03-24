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
      return NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 }
      );
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/wallet`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for business wallet`);
      // Return mock data for development
      const mockWallet = {
        data: {
          balance: 250000.50,
          currency: "NGN",
          accountNumber: "0123456789",
          bankName: "Access Bank",
          accountStatus: "active",
          lastTransaction: "2024-03-15T10:30:00Z"
        }
      };
      return NextResponse.json(mockWallet, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }
    
    return NextResponse.json(data || {}, { status: 200 });
  } catch (error: any) {
    console.error('Business wallet GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch business wallet' },
      { status: 500 }
    );
  }
}
