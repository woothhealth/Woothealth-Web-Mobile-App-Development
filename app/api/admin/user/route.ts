import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const mockUsers = [
  {
    email: "blessing.a@woothealth.com",
    password: "123456789",
    phone: "+2348065872879",
    firstName: "Blessing",
    lastName: "Blessing",
    userId: "WHT-0015-X",
    role: "admin",
    status: "active",
    dateOfBirth: "2026-04-22T00:00:00.000+00:00",
    gender: "female",
    $id: "WHT-0015-X",
    $createdAt: "2026-04-22T12:07:11.818+00:00",
    $updatedAt: "2026-04-22T12:07:11.818+00:00",
  },
  {
    email: "user2@example.com",
    password: "123456789",
    phone: "+2348012345678",
    firstName: "John",
    lastName: "Doe",
    userId: "WHT-0016-X",
    role: "user",
    status: "active",
    dateOfBirth: "1990-01-01T00:00:00.000+00:00",
    gender: "male",
    $id: "WHT-0016-X",
    $createdAt: "2026-04-22T12:07:11.818+00:00",
    $updatedAt: "2026-04-22T12:07:11.818+00:00",
  },
];

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || url.searchParams.get("view") || "10");
    const userId = url.searchParams.get("userId") || url.searchParams.get("id");

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        if (userId) {
          const backendRes = await fetch(BACKEND_URL + "/admin/users/" + userId, {
            headers: { ...getAdminHeaders(cookieHeader) },
            credentials: "include",
            next: { revalidate: 300 },
          });

          if (backendRes.ok) {
            const data = await backendRes.json();
            try {
              const payload = data?.data ?? data;
              const sample = Array.isArray(payload) ? payload.slice(0, 10) : [payload];
            } catch (e) {
              // console.debug("admin/user GET backend returned non-iterable data", { page, limit, data });
            }
            return NextResponse.json(data);
          }
        } else {
          const backendRes = await fetch(
            BACKEND_URL + `/admin/users/?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
            {
              headers: { ...getAdminHeaders(cookieHeader) },
              credentials: "include",
              next: { revalidate: 300 },
            }
          );

          if (backendRes.ok) {
            const data = await backendRes.json();
            try {
              const payload = data?.data ?? data;
              const sample = Array.isArray(payload) ? payload.slice(0, 10) : [payload];
              // console.debug("admin/user GET backend returned users", { page, limit, sample });
            } catch (e) {
              // console.debug("admin/user GET backend returned non-iterable data", { page, limit, data });
            }
            return NextResponse.json(data);
          }
        }
      } catch (backendError) {
        // fall through to mock
      }
    }

    // mock fallback
    if (userId) {
      const user = mockUsers.find((u) => u.userId === userId || u.$id === userId);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: user, message: "User retrieved (mock)" }, { status: 200 });
    }

    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter((user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
    try {
      const sample = paginatedUsers.slice(0, 10);
      // console.debug("admin/user GET mock returning users", { page, limit, sample });
    } catch (e) {
      // console.debug("admin/user GET mock returning data", { page, limit, paginatedUsers });
    }

    return NextResponse.json({ success: true, data: paginatedUsers, total: filteredUsers.length, message: "Users list retrieved (mock)" }, { status: 200 });
  } catch (error) {
    // console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    // console.debug('API /api/admin/user (POST) payload=', body);
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(BACKEND_URL + "/admin/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAdminHeaders(cookieHeader) },
          body: JSON.stringify(body),
          credentials: "include",
        });

        const text = await backendRes.text().catch(() => "");
        let parsed: any = {};
        try { parsed = JSON.parse(text); } catch { parsed = { error: text }; }

        if (backendRes.ok) return NextResponse.json(parsed);
        return NextResponse.json(parsed, { status: backendRes.status });
      } catch (backendError) {
        // fall back to mock
      }
    }

    const newUser = { ...body, $id: `WHT-${Date.now()}`, $createdAt: new Date().toISOString() };
    mockUsers.push(newUser as any);
    return NextResponse.json({ success: true, data: newUser, message: "User created successfully (mock)" }, { status: 201 });
  } catch (error) {
    // console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const id = body?.id || body?.userId || body?.$id;

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const targetUrl = id ? `${BACKEND_URL}/admin/users/${id}` : `${BACKEND_URL}/admin/users/`;
        const backendRes = await fetch(targetUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAdminHeaders(cookieHeader) },
          body: JSON.stringify(body),
          credentials: "include",
        });

        const text = await backendRes.text().catch(() => "");
        let parsed: any = {};
        try { parsed = JSON.parse(text); } catch { parsed = { error: text }; }

        if (backendRes.ok) return NextResponse.json(parsed);
        return NextResponse.json(parsed, { status: backendRes.status });
      } catch (backendError) {
        // fall through to mock
      }
    }

    const lookupId = id || (body && (body.userId || body.$id));
    const index = mockUsers.findIndex((user) => user.$id === lookupId || user.userId === lookupId);
    if (index === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });

    mockUsers[index] = { ...mockUsers[index], ...body, $updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true, data: mockUsers[index], message: "User updated successfully (mock)" }, { status: 200 });
  } catch (error) {
    // console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(BACKEND_URL + "/admin/users/" + id, {
          method: "DELETE",
          headers: { ...getAdminHeaders(cookieHeader) },
          credentials: "include",
        });

        const text = await backendRes.text().catch(() => "");
        let parsed: any = {};
        try { parsed = JSON.parse(text); } catch { parsed = { error: text }; }

        if (backendRes.ok) return NextResponse.json(parsed);
      } catch (backendError) {
        // fall back to mock
      }
    }

    const index = mockUsers.findIndex((user) => user.$id === id);
    if (index === -1) return NextResponse.json({ error: "User not found" }, { status: 404 });
    mockUsers.splice(index, 1);
    return NextResponse.json({ success: true, message: "User deleted successfully (mock)" }, { status: 200 });
  } catch (error) {
    // console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
