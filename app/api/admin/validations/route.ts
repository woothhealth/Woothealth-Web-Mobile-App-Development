import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const mockValidations = [
  {
    "id": "VAL-001",
    "dateOfService": "2024-01-15",
    "provider": "De Gem Hospital",
    "patient": "John Doe",
    "hmoId": "HMO-12345",
    "status": "approved"
  },
  {
    "id": "VAL-002",
    "dateOfService": "2024-01-16",
    "provider": "Sunshine Medical Center",
    "patient": "Jane Smith",
    "hmoId": "HMO-67890",
    "status": "declined"
  },
  {
    "id": "VAL-003",
    "dateOfService": "2024-01-17",
    "provider": "Vision Care Optical",
    "patient": "Bob Johnson",
    "hmoId": "HMO-11111",
    "status": "pending"
  },
  {
    "id": "VAL-004",
    "dateOfService": "2024-01-18",
    "provider": "De Gem Hospital",
    "patient": "Alice Brown",
    "hmoId": "HMO-22222",
    "status": "approved"
  },
  {
    "id": "VAL-005",
    "dateOfService": "2024-01-19",
    "provider": "Sunshine Medical Center",
    "patient": "Charlie Wilson",
    "hmoId": "HMO-33333",
    "status": "declined"
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
    const validationId = url.searchParams.get('validationId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Always try backend first, fallback to mock only if backend is completely unavailable
    if (BACKEND_URL) {
      try {
        if (validationId) {
          const backendRes = await fetch(
            BACKEND_URL + "/admin/validations/" + validationId,
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
            BACKEND_URL + `/admin/validations/?page=${page}&limit=${limit}`,
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
    if (validationId) {
      const validation = mockValidations.find(v => v.id === validationId);
      if (!validation) {
        return NextResponse.json({ error: "Validation not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: validation,
        message: "Validation retrieved (mock)"
      }, { status: 200 });
    }

    const startIndex = (page - 1) * limit;
    const paginatedValidations = mockValidations.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedValidations,
      total: mockValidations.length,
      message: "Validations list retrieved"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching validations:", error);
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
          BACKEND_URL + "/admin/validations/",
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
    const newValidation = {
      ...body,
      id: `VAL-${Date.now()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    };
    mockValidations.push(newValidation);
    return NextResponse.json({
      success: true,
      data: newValidation,
      message: "Validation created successfully (mock)"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating validation:", error);
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
          BACKEND_URL + "/admin/validations/" + id,
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
    const index = mockValidations.findIndex(validation => validation.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Validation not found" }, { status: 404 });
    }
    mockValidations[index] = { ...mockValidations[index], ...updateData };
    return NextResponse.json({
      success: true,
      data: mockValidations[index],
      message: "Validation updated successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating validation:", error);
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
      return NextResponse.json({ error: "Validation ID required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/validations/" + id,
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
    const index = mockValidations.findIndex(validation => validation.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Validation not found" }, { status: 404 });
    }
    mockValidations.splice(index, 1);
    return NextResponse.json({
      success: true,
      message: "Validation deleted successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting validation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}