import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const mockTelemedicine = [
  {
    "id": "TEL-001",
    "telemedicineId": "TEL-20260417-001",
    "dateOfService": "2026-04-17T10:00:00Z",
    "patient": "John Doe",
    "hmoId": "HMO-12345",
    "doctor": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "duration": "30 minutes",
    "status": "completed",
    "supportedDocuments": 3,
    "patientId": "WHT-0001-A",
    "doctorId": "DOC-001",
    "$id": "TEL-001",
    "$createdAt": "2026-04-17T09:00:00.000+00:00",
    "$updatedAt": "2026-04-17T10:30:00.000+00:00"
  },
  {
    "id": "TEL-002",
    "telemedicineId": "TEL-20260418-002",
    "dateOfService": "2026-04-18T14:30:00Z",
    "patient": "Jane Smith",
    "hmoId": "HMO-67890",
    "doctor": "Dr. Michael Chen",
    "specialization": "Dermatology",
    "duration": "45 minutes",
    "status": "ongoing",
    "supportedDocuments": 2,
    "patientId": "WHT-0002-B",
    "doctorId": "DOC-002",
    "$id": "TEL-002",
    "$createdAt": "2026-04-18T14:00:00.000+00:00",
    "$updatedAt": "2026-04-18T14:30:00.000+00:00"
  },
  {
    "id": "TEL-003",
    "telemedicineId": "TEL-20260419-003",
    "dateOfService": "2026-04-19T09:15:00Z",
    "patient": "Bob Johnson",
    "hmoId": "HMO-11111",
    "doctor": "Dr. Emily Davis",
    "specialization": "Pediatrics",
    "duration": "25 minutes",
    "status": "scheduled",
    "supportedDocuments": 1,
    "patientId": "WHT-0003-C",
    "doctorId": "DOC-003",
    "$id": "TEL-003",
    "$createdAt": "2026-04-19T08:00:00.000+00:00",
    "$updatedAt": "2026-04-19T08:00:00.000+00:00"
  },
  {
    "id": "TEL-004",
    "telemedicineId": "TEL-20260420-004",
    "dateOfService": "2026-04-20T11:00:00Z",
    "patient": "Alice Brown",
    "hmoId": "HMO-22222",
    "doctor": "Dr. David Wilson",
    "specialization": "Orthopedics",
    "duration": "40 minutes",
    "status": "completed",
    "supportedDocuments": 4,
    "patientId": "WHT-0004-D",
    "doctorId": "DOC-004",
    "$id": "TEL-004",
    "$createdAt": "2026-04-20T10:00:00.000+00:00",
    "$updatedAt": "2026-04-20T11:40:00.000+00:00"
  },
  {
    "id": "TEL-005",
    "telemedicineId": "TEL-20260421-005",
    "dateOfService": "2026-04-21T16:00:00Z",
    "patient": "Charlie Wilson",
    "hmoId": "HMO-33333",
    "doctor": "Dr. Lisa Anderson",
    "specialization": "Gynecology",
    "duration": "35 minutes",
    "status": "scheduled",
    "supportedDocuments": 2,
    "patientId": "WHT-0005-E",
    "doctorId": "DOC-005",
    "$id": "TEL-005",
    "$createdAt": "2026-04-21T15:00:00.000+00:00",
    "$updatedAt": "2026-04-21T15:00:00.000+00:00"
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
    const telemedicineId = url.searchParams.get('telemedicineId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Always try backend first, fallback to mock only if backend is completely unavailable
    if (BACKEND_URL) {
      try {
        if (telemedicineId) {
          const backendRes = await fetch(
            BACKEND_URL + "/admin/telemedicine/" + telemedicineId,
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
            BACKEND_URL + `/admin/telemedicine/?page=${page}&limit=${limit}`,
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
    if (telemedicineId) {
      const telemedicine = mockTelemedicine.find(t => t.$id === telemedicineId);
      if (!telemedicine) {
        return NextResponse.json({ error: "Telemedicine not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: telemedicine,
        message: "Telemedicine retrieved (mock)"
      }, { status: 200 });
    }

    const startIndex = (page - 1) * limit;
    const paginatedTelemedicine = mockTelemedicine.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedTelemedicine,
      total: mockTelemedicine.length,
      message: "Telemedicine requests retrieved"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching telemedicine:", error);
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
          BACKEND_URL + "/admin/telemedicine/",
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
    const newTelemedicine = {
      ...body,
      $id: `TEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      telemedicineId: body.telemedicineId || `TEL-${Date.now()}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
    };
    mockTelemedicine.push(newTelemedicine);
    return NextResponse.json({
      success: true,
      data: newTelemedicine,
      message: "Telemedicine created successfully (mock)"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating telemedicine:", error);
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
          BACKEND_URL + "/admin/telemedicine/" + id,
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
    const index = mockTelemedicine.findIndex(telemedicine => telemedicine.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Telemedicine not found" }, { status: 404 });
    }
    mockTelemedicine[index] = { ...mockTelemedicine[index], ...updateData, $updatedAt: new Date().toISOString() };
    return NextResponse.json({
      success: true,
      data: mockTelemedicine[index],
      message: "Telemedicine updated successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating telemedicine:", error);
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
      return NextResponse.json({ error: "Telemedicine ID required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/telemedicine/" + id,
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
    const index = mockTelemedicine.findIndex(telemedicine => telemedicine.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Telemedicine not found" }, { status: 404 });
    }
    mockTelemedicine.splice(index, 1);
    return NextResponse.json({
      success: true,
      message: "Telemedicine deleted successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting telemedicine:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}