import { NextResponse } from "next/server";
import { requireBusinessRole, getBusinessHeaders } from "@/lib/businessGuard";

export async function DELETE(
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

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/settings/payment-methods/${id}`,
      {
        method: "DELETE",
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.error(`Failed to delete payment method ${id}: ${backendRes.status}`);
      
      if (backendRes.status === 404) {
        return NextResponse.json(
          { error: 'Payment method not found' },
          { status: 404 }
        );
      }
      
      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: 'Cannot delete default payment method' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to delete payment method' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json({ message: "Payment method deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error('Business payment methods DELETE error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}
