import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

const mockProviders = [
  {
    "sn": 283,
    "name": "De Gem Hospital",
    "email": [
      "degemhospital23@gmail.com"
    ],
    "phone": [
      "2.35E+12"
    ],
    "address": "25, Waksad Street, Adamo Ikorodu Lagos.",
    "state": "Lagos",
    "local_govt": null,
    "lat": null,
    "long": null,
    "tier": "Tier D",
    "type": "Hospital",
    "remark": "General Surgery; Internal Medicine; Obstetrics & Gynaecology; Pharmacy; Laboratory; Paediatrics;",
    "hasLogin": true,
    "city": null,
    "specialization": null,
    "providerCode": null,
    "providerTariff": [
      "hospital"
    ],
    "customTariff": true,
    "$id": "WHP-10251-A",
    "$sequence": 3618,
    "$createdAt": "2026-04-12T11:04:04.493+00:00",
    "$updatedAt": "2026-04-22T12:00:29.084+00:00",
    "$permissions": [
      "read(\"any\")"
    ],
    "$databaseId": "providers",
    "$collectionId": "providers"
  },
  {
    "sn": 284,
    "name": "Sunshine Medical Center",
    "email": [
      "sunshine@gmail.com"
    ],
    "phone": [
      "2.34E+12"
    ],
    "address": "123, Hospital Lane, Lagos",
    "state": "Lagos",
    "local_govt": null,
    "lat": null,
    "long": null,
    "tier": "Tier A",
    "type": "Dental Clinic",
    "remark": "Dental services; Orthodontics; Implants;",
    "hasLogin": true,
    "city": null,
    "specialization": null,
    "providerCode": null,
    "providerTariff": [
      "dental"
    ],
    "customTariff": false,
    "$id": "WHP-10252-B",
    "$sequence": 3619,
    "$createdAt": "2026-04-13T11:04:04.493+00:00",
    "$updatedAt": "2026-04-23T12:00:29.084+00:00",
    "$permissions": [
      "read(\"any\")"
    ],
    "$databaseId": "providers",
    "$collectionId": "providers"
  },
  {
    "sn": 285,
    "name": "Vision Care Optical",
    "email": [
      "visioncare@gmail.com"
    ],
    "phone": [
      "2.36E+12"
    ],
    "address": "456, Vision Street, Abuja",
    "state": "FCT",
    "local_govt": null,
    "lat": null,
    "long": null,
    "tier": "Tier B",
    "type": "Optical Clinic",
    "remark": "Eye care; Spectacles; Contact lenses;",
    "hasLogin": false,
    "city": null,
    "specialization": null,
    "providerCode": null,
    "providerTariff": [
      "optical"
    ],
    "customTariff": true,
    "$id": "WHP-10253-C",
    "$sequence": 3620,
    "$createdAt": "2026-04-14T11:04:04.493+00:00",
    "$updatedAt": "2026-04-24T12:00:29.084+00:00",
    "$permissions": [
      "read(\"any\")"
    ],
    "$databaseId": "providers",
    "$collectionId": "providers"
  }
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
    const providerId = url.searchParams.get('providerId');

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Always try backend first, fallback to mock only if backend is completely unavailable
    if (BACKEND_URL) {
      try {
        if (providerId) {
          const backendRes = await fetch(
            BACKEND_URL + "/admin/providers/" + providerId,
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
            BACKEND_URL + `/admin/providers/?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
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
    if (providerId) {
      const provider = mockProviders.find(p => p.$id === providerId);
      if (!provider) {
        return NextResponse.json({ error: "Provider not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: provider,
        message: "Provider retrieved (mock)"
      }, { status: 200 });
    }

    let filteredProviders = mockProviders;
    if (search) {
      filteredProviders = mockProviders.filter(provider =>
        provider.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.type.toLowerCase().includes(search.toLowerCase()) ||
        provider.address.toLowerCase().includes(search.toLowerCase()) ||
        provider.state.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedProviders = filteredProviders.slice(startIndex, startIndex + limit);

    // Calculate stats
    const stats = {
      hospitals: mockProviders.filter(p => p.type === 'Hospital').length,
      dental_clinics: mockProviders.filter(p => p.type === 'Dental Clinic').length,
      optical_clinics: mockProviders.filter(p => p.type === 'Optical Clinic').length,
      spas: mockProviders.filter(p => p.type === 'Spa').length,
      diagnostic_centers: mockProviders.filter(p => p.type === 'Diagnostic Center').length,
      gyms: mockProviders.filter(p => p.type === 'Gym').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        providers: paginatedProviders,
        total: filteredProviders.length,
        stats: stats
      },
      message: "Providers list retrieved (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching providers:", error);
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
          BACKEND_URL + "/admin/providers/",
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
    const newProvider = { 
      ...body, 
      $id: `WHP-${Date.now()}-${Math.random().toString(36).substr(2, 1).toUpperCase()}`,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      sn: mockProviders.length + 1
    };
    mockProviders.push(newProvider);
    return NextResponse.json({
      success: true,
      data: newProvider,
      message: "Provider created successfully (mock)"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating provider:", error);
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
          BACKEND_URL + "/admin/providers/" + id,
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
    const index = mockProviders.findIndex(provider => provider.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    mockProviders[index] = { ...mockProviders[index], ...updateData, $updatedAt: new Date().toISOString() };
    return NextResponse.json({
      success: true,
      data: mockProviders[index],
      message: "Provider updated successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating provider:", error);
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
      return NextResponse.json({ error: "Provider ID required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const backendRes = await fetch(
          BACKEND_URL + "/admin/providers/" + id,
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
    const index = mockProviders.findIndex(provider => provider.$id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }
    mockProviders.splice(index, 1);
    return NextResponse.json({
      success: true,
      message: "Provider deleted successfully (mock)"
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
