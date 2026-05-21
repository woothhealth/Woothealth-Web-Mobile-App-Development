import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const mockUsers = [
  {
    "email": "blessing.a@woothealth.com",
    "password": "123456789",
    "phone": "+2348065872879",
    "firstName": "Blessing",
    "lastName": "Blessing",
    "userId": "WHT-0015-X",
    "role": "admin",
    "specialization": "",
    "availability": true,
    "plan": null,
    "latitude": null,
    "longitude": null,
    "profile_pic": null,
    "businessId": "",
    "status": "active",
    "department": "",
    "dateOfBirth": "2026-04-22T00:00:00.000+00:00",
    "gender": "female",
    "enrolleeNumber": "",
    "policyNumber": null,
    "otherNames": "",
    "relationship": "principal",
    "providerCode": "",
    "providerName": "",
    "providerState": "",
    "preExistingCond": "",
    "passportUrl": null,
    "nakasoft_id": null,
    "source": null,
    "fcmToken": null,
    "$id": "WHT-0015-X",
    "$sequence": 85,
    "$createdAt": "2026-04-22T12:07:11.818+00:00",
    "$updatedAt": "2026-04-22T12:07:11.818+00:00",
    "$permissions": [
      "read(\"any\")",
      "update(\"user:WHT-0015-X\")",
      "delete(\"user:WHT-0015-X\")"
    ],
    "$databaseId": "users",
    "$collectionId": "users"
  },
  // Add more mock users for testing pagination
  {
    "email": "user2@example.com",
    "password": "123456789",
    "phone": "+2348012345678",
    "firstName": "John",
    "lastName": "Doe",
    "userId": "WHT-0016-X",
    "role": "user",
    "specialization": "",
    "availability": true,
    "plan": null,
    "latitude": null,
    "longitude": null,
    "profile_pic": null,
    "businessId": "",
    "status": "active",
    "department": "",
    "dateOfBirth": "1990-01-01T00:00:00.000+00:00",
    "gender": "male",
    "enrolleeNumber": "",
    "policyNumber": null,
    "otherNames": "",
    "relationship": "principal",
    "providerCode": "",
    "providerName": "",
    "providerState": "",
    "preExistingCond": "",
    "passportUrl": null,
    "nakasoft_id": null,
    "source": null,
    "fcmToken": null,
    "$id": "WHT-0016-X",
    "$sequence": 86,
    "$createdAt": "2026-04-22T12:07:11.818+00:00",
    "$updatedAt": "2026-04-22T12:07:11.818+00:00",
    "$permissions": [
      "read(\"any\")",
      "update(\"user:WHT-0016-X\")",
      "delete(\"user:WHT-0016-X\")"
    ],
    "$databaseId": "users",
    "$collectionId": "users"
  },
  // Add more as needed for testing
];

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 20;
    const userId = url.searchParams.get('userId') || url.searchParams.get('id');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Always try backend first, fallback to mock only if backend is completely unavailable
    if (BACKEND_URL) {
      try {
        if (userId) {
          const backendRes = await fetch(
            BACKEND_URL + "/admin/tariffs/" + userId,
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
            BACKEND_URL + `/admin/tariffs/?search=${encodeURIComponent(search)}`,
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
    if (userId) {
      const user = mockUsers.find(u => u.userId === userId || u.$id === userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: user, // Return single user object, not array
        message: "User retrieved (mock)"
      }, { status: 200 });
    }

    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter(user =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      total: filteredUsers.length,
      totalProviders: 286, // Mock value
      message: "Users list retrieved (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    console.log("POST /api/admin/user - Received body:", body);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    console.log("POST /api/admin/user - BACKEND_URL:", BACKEND_URL);

    if (BACKEND_URL) {
      try {
        console.log("POST /api/admin/user - Attempting backend call to:", BACKEND_URL + "/admin/tariffs/");
        const backendRes = await fetch(
          BACKEND_URL + "/admin/tariffs/",
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

        console.log("POST /api/admin/user - Backend response status:", backendRes.status);
        console.log("POST /api/admin/user - Backend response ok:", backendRes.ok);

        if (backendRes.ok) {
          const data = await backendRes.json();
          console.log("POST /api/admin/user - Backend response data:", data);
          return NextResponse.json(data);
        } else {
          // Return backend error instead of falling back to mock
          // This handles validation errors (409, 400), auth errors, etc.
          const errorData = await backendRes.text();
          console.log("POST /api/admin/user - Backend response not ok, error data:", errorData);
          
          let parsedError: any = { error: errorData };
          try {
            parsedError = JSON.parse(errorData);
          } catch (e) {
            // If not valid JSON, keep the text error
          }
          
          console.log("POST /api/admin/user - Returning backend error to frontend");
          return NextResponse.json(parsedError, { status: backendRes.status });
        }
      } catch (backendError) {
        console.log("POST /api/admin/user - Backend request failed with error:", backendError);
        // Backend is unreachable/network error - fall back to mock only in this case
        console.log("POST /api/admin/user - Backend unreachable, falling back to mock");
      }
    } else {
      console.log("POST /api/admin/user - No BACKEND_URL configured, using mock");
    }

    // Fallback to mock only if backend is completely unavailable
    console.log("POST /api/admin/user - Falling back to mock data creation");
    const newUser = { ...body, $id: `WHT-${Date.now()}`, $createdAt: new Date().toISOString() };
    console.log("POST /api/admin/user - Created mock user:", newUser);
    mockUsers.push(newUser);
    console.log("POST /api/admin/user - Mock users array now has", mockUsers.length, "users");
    return NextResponse.json({
      success: true,
      data: newUser,
      message: "User created successfully (mock)"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
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
          BACKEND_URL + "/admin/tariffs/" + id,
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
    const index = mockUsers.findIndex(user => user.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    mockUsers[index] = { ...mockUsers[index], ...updateData, $updatedAt: new Date().toISOString() };
    return NextResponse.json({
      success: true,
      data: mockUsers[index],
      message: "User updated successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
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
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/tariffs/" + id,
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
    const index = mockUsers.findIndex(user => user.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    mockUsers.splice(index, 1);
    return NextResponse.json({
      success: true,
      message: "User deleted successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}