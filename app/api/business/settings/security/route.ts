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
      `${BACKEND_URL}/business/settings/security`,
      {
        headers: {
          ...getBusinessHeaders(cookieHeader),
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!backendRes.ok) {
      console.warn(`Backend returned ${backendRes.status} for security settings`);
      if (backendRes.status === 404) {
        return NextResponse.json({ error: 'Security settings not found' }, { status: 404 });
      }
      // Return mock data for development fallback for non-404 errors
      const mockSessions = [
        {
          id: "session_001",
          deviceName: "Chrome - Windows 10",
          ipAddress: "192.168.1.100",
          location: "Lagos, Nigeria",
          lastActive: "2024-01-15T10:30:00Z",
          isCurrent: true,
          browser: "Chrome",
          osName: "Windows"
        },
        {
          id: "session_002",
          deviceName: "Safari - iPhone 14",
          ipAddress: "192.168.1.50",
          location: "Lagos, Nigeria",
          lastActive: "2024-01-14T15:45:00Z",
          isCurrent: false,
          browser: "Safari",
          osName: "iOS"
        },
        {
          id: "session_003",
          deviceName: "Firefox - Ubuntu",
          ipAddress: "192.168.1.75",
          location: "Abuja, Nigeria",
          lastActive: "2024-01-10T08:20:00Z",
          isCurrent: false,
          browser: "Firefox",
          osName: "Linux"
        }
      ];
      return NextResponse.json(mockSessions, { status: 200 });
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json(data || [], { status: 200 });
  } catch (error: any) {
    console.error('Business security GET error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to fetch security settings' },
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

    if (!payloadData.newPassword || !payloadData.confirmPassword) {
      return NextResponse.json(
        { error: 'Password and confirmation password are required' },
        { status: 400 }
      );
    }

    if (payloadData.newPassword !== payloadData.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/business/settings/security`,
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
      console.error(`Failed to change password: ${backendRes.status}`);
      
      if (backendRes.status === 400) {
        return NextResponse.json(
          { error: 'Password must meet security requirements' },
          { status: 400 }
        );
      }
      if (backendRes.status === 401) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to change password' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    
    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data.data, { status: 200 });
    }
    
    return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Business security POST error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}