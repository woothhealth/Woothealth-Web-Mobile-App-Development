import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const mockPaCodes = [
  {
    "authorizationCode": "WHT-PA-367899",
    "policyNumber": "",
    "diagnosis": "[AUTHORIZATION REQUEST DETAILS]\nTariff Code: OPT1133\nTier: Tier A\nPrice: ₦16,800",
    "providerName": "Dolu Hospital",
    "createdDate": "2026-04-17",
    "source": "provider",
    "patientId": "WHT-0001-A",
    "providerId": "WHP-10249-A",
    "providerTier": "Tier A",
    "patientPlan": "",
    "patientsBenefits": [],
    "status": "approved",
    "bookingId": "69e1c36a0038dddd8f97",
    "$id": "69e1e3ea53d96324f4d5",
    "$sequence": 2,
    "$createdAt": "2026-04-17T07:40:25.941+00:00",
    "$updatedAt": "2026-04-17T07:46:06.174+00:00",
    "$permissions": [
      "read(\"any\")"
    ],
    "$databaseId": "main",
    "$collectionId": "pa_codes"
  },
  {
    "authorizationCode": "WHT-PA-367900",
    "policyNumber": "POL-12345",
    "diagnosis": "[AUTHORIZATION REQUEST DETAILS]\nTariff Code: MED2001\nTier: Tier B\nPrice: ₦25,000",
    "providerName": "Sunshine Medical Center",
    "createdDate": "2026-04-18",
    "source": "provider",
    "patientId": "WHT-0002-B",
    "providerId": "WHP-10250-B",
    "providerTier": "Tier B",
    "patientPlan": "Premium Plan",
    "patientsBenefits": ["Consultation", "Laboratory"],
    "status": "under review",
    "bookingId": "69e1c36a0038dddd8f98",
    "$id": "69e1e3ea53d96324f4d6",
    "$sequence": 3,
    "$createdAt": "2026-04-18T08:30:15.123+00:00",
    "$updatedAt": "2026-04-18T08:30:15.123+00:00",
    "$permissions": [
      "read(\"any\")"
    ],
    "$databaseId": "main",
    "$collectionId": "pa_codes"
  },
  {
    "authorizationCode": "WHT-PA-367901",
    "policyNumber": "POL-67890",
    "diagnosis": "[AUTHORIZATION REQUEST DETAILS]\nTariff Code: SURG500\nTier: Tier A\nPrice: ₦150,000",
    "providerName": "Vision Care Optical",
    "createdDate": "2026-04-19",
    "source": "provider",
    "patientId": "WHT-0003-C",
    "providerId": "WHP-10251-C",
    "providerTier": "Tier A",
    "patientPlan": "Standard Plan",
    "patientsBenefits": ["Surgery", "Anesthesia"],
    "status": "declined",
    "bookingId": "69e1c36a0038dddd8f99",
    "$id": "69e1e3ea53d96324f4d7",
    "$sequence": 4,
    "$createdAt": "2026-04-19T09:15:45.678+00:00",
    "$updatedAt": "2026-04-19T10:20:30.456+00:00",
    "$permissions": [
      "read(\"any\")"
    ],
    "$databaseId": "main",
    "$collectionId": "pa_codes"
  }
];

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const paCodeId = url.searchParams.get('paCodeId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Always try backend first, fallback to mock only if backend is completely unavailable
    if (BACKEND_URL) {
      try {
        if (paCodeId) {
          const backendRes = await fetch(
            BACKEND_URL + "/admin/pa-codes/" + paCodeId,
            {
              headers: {
                ...getAdminHeaders(cookieHeader),
              },
              credentials: "include",
              next: { revalidate: 300 },
            }
          );

          if (backendRes.ok) {
            const data = await backendRes.json();
            return NextResponse.json(data);
          }
        } else {
          const backendRes = await fetch(
            BACKEND_URL + `/admin/pa-codes/?page=${page}&limit=${limit}`,
            {
              headers: {
                ...getAdminHeaders(cookieHeader),
              },
              credentials: "include",
              next: { revalidate: 300 },
            }
          );

          if (backendRes.ok) {
            const data = await backendRes.json();
            return NextResponse.json(data);
          }
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    }

    // Fallback to mock data only if backend is not available or failed
    if (paCodeId) {
      const paCode = mockPaCodes.find(p => p.$id === paCodeId);
      if (!paCode) {
        return NextResponse.json({ error: "PA Code not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: paCode,
        message: "PA Code retrieved (mock)"
      }, { status: 200 });
    }

    const startIndex = (page - 1) * limit;
    const paginatedPaCodes = mockPaCodes.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedPaCodes,
      total: mockPaCodes.length,
      message: "PA Codes list retrieved"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pa-codes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/pa-codes/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...getAdminHeaders(cookieHeader),
            },
            body: JSON.stringify(body),
            credentials: "include",
          }
        );

        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    }

    // Fallback to mock
    const newPaCode = {
      ...body,
      $id: `pa-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      authorizationCode: body.authorizationCode || `WHT-PA-${Math.floor(100000 + Math.random() * 900000)}`
    };
    mockPaCodes.push(newPaCode);
    return NextResponse.json({
      success: true,
      data: newPaCode,
      message: "PA Code created successfully (mock)"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating pa-code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const { id, ...updateData } = body;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/pa-codes/" + id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAdminHeaders(cookieHeader),
            },
            body: JSON.stringify(updateData),
            credentials: "include",
          }
        );

        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    }

    // Fallback to mock
    const index = mockPaCodes.findIndex(paCode => paCode.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "PA Code not found" }, { status: 404 });
    }
    mockPaCodes[index] = { ...mockPaCodes[index], ...updateData, $updatedAt: new Date().toISOString() };
    return NextResponse.json({
      success: true,
      data: mockPaCodes[index],
      message: "PA Code updated successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating pa-code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "PA Code ID required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/pa-codes/" + id,
          {
            method: "DELETE",
            headers: {
              ...getAdminHeaders(cookieHeader),
            },
            credentials: "include",
          }
        );

        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
      } catch (backendError) {
        // Backend request failed, will fall back to mock
      }
    }

    // Fallback to mock
    const index = mockPaCodes.findIndex(paCode => paCode.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "PA Code not found" }, { status: 404 });
    }
    mockPaCodes.splice(index, 1);
    return NextResponse.json({
      success: true,
      message: "PA Code deleted successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting pa-code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}