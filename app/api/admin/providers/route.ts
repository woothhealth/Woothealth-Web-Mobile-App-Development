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

    // Clean updateData: remove empty strings, empty arrays, null/undefined, and trim strings
    const cleanValue = (v: any): any => {
      if (v === null || v === undefined) return undefined;
      if (typeof v === 'string') {
        const t = v.trim();
        return t === '' ? undefined : t;
      }
      if (Array.isArray(v)) {
        const arr = v.map((it) => (typeof it === 'string' ? it.trim() : it)).filter((it) => it !== '' && it !== null && it !== undefined);
        return arr.length === 0 ? undefined : arr;
      }
      if (typeof v === 'object') {
        const o: any = {};
        for (const [k, val] of Object.entries(v)) {
          const cleaned = cleanValue(val);
          if (cleaned !== undefined) o[k] = cleaned;
        }
        return Object.keys(o).length === 0 ? undefined : o;
      }
      return v;
    };

    const cleanedUpdateData: any = {};
    for (const [k, v] of Object.entries(updateData)) {
      const cleaned = cleanValue(v);
      if (cleaned !== undefined) cleanedUpdateData[k] = cleaned;
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (BACKEND_URL) {
      try {
        const targetUrl = BACKEND_URL + "/admin/providers/" + id;

        if (!id) {
          return NextResponse.json({ error: 'Provider id (documentId) is required' }, { status: 400 });
        }

        if (Object.keys(cleanedUpdateData).length === 0) {
          return NextResponse.json({ error: 'No changes to update' }, { status: 400 });
        }

        // Backend expects documentId + updated data
        const forwardBody = { documentId: id, data: cleanedUpdateData };
        const backendRes = await fetch(targetUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAdminHeaders(cookieHeader),
          },
          body: JSON.stringify(forwardBody),
          credentials: "include",
        });

        const respText = await backendRes.text().catch(() => '');
        if (backendRes.ok) {
          let data: any = {};
          try { data = JSON.parse(respText); } catch { data = { text: respText }; }
          return NextResponse.json(data);
        } else {
          // Log backend error for debugging (status + body)
          let parsedErr: any = { error: respText };
          try { parsedErr = JSON.parse(respText); } catch {}
          console.error('admin/providers PUT backend error', { targetUrl, status: backendRes.status, response: parsedErr });
          return NextResponse.json(parsedErr, { status: backendRes.status });
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
