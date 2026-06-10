import { NextResponse } from "next/server";
import { requireAdminRole, getAdminHeaders } from "@/lib/adminGuard";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    // Parse query parameters
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const claimId = url.searchParams.get('id'); // Check for individual claim ID
    const limit = 20; // Fixed limit for now

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    // Handle individual claim request
    if (claimId) {
      if (!BACKEND_URL) {
        // console.error('Missing BACKEND_URL environment variable');
        // Return mock data for development
        const mockClaims = [
          {
            claimType: "Emergency Care",
            userId: "WHT-0001-A",
            dateOfService: "2026-01-30T00:00:00.000+00:00",
            hospitalProvider: "Minna General Hospital",
            description: "Emergency treatment",
            status: "pending",
            amount: 5000,
            reviewNotes: "",
            approvedAmount: null,
            submittedDate: "2026-01-30T16:22:13.305+00:00",
            processedDate: null,
            documents: [],
            policy_number: null,
            diagnosis: null,
            referred_from_code: null,
            referred_from_name: null,
            referred_to_code: null,
            referred_to_name: null,
            created: null,
            source: null,
            $id: "697ccca54a8611d1153f",
            $sequence: 1,
            $createdAt: "2026-01-30T15:22:15.014+00:00",
            $updatedAt: "2026-01-30T15:22:15.014+00:00",
            $permissions: ["read(\"user:WHT-0001-A\")", "update(\"user:WHT-0001-A\")", "delete(\"user:WHT-0001-A\")"],
            $databaseId: "main",
            $collectionId: "claims"
          },
          {
            claimType: "Maternity Care",
            userId: "WHT-0004-A",
            dateOfService: "2026-01-29T00:00:00.000+00:00",
            hospitalProvider: "Kaduna Teaching Hospital",
            description: "Maternity services",
            status: "approved",
            amount: 25000,
            reviewNotes: "Approved for full amount",
            approvedAmount: 25000,
            submittedDate: "2026-01-30T19:11:08.096+00:00",
            processedDate: "2026-01-31T10:00:00.000+00:00",
            documents: [],
            policy_number: null,
            diagnosis: null,
            referred_from_code: null,
            referred_from_name: null,
            referred_to_code: null,
            referred_to_name: null,
            created: null,
            source: null,
            $id: "697cf43c177a89d17ec7",
            $sequence: 2,
            $createdAt: "2026-01-30T18:11:08.902+00:00",
            $updatedAt: "2026-01-31T10:00:00.000+00:00",
            $permissions: ["read(\"user:WHT-0004-A\")", "update(\"user:WHT-0004-A\")", "delete(\"user:WHT-0004-A\")"],
            $databaseId: "main",
            $collectionId: "claims"
          },
          {
            claimType: "Outpatient Care",
            userId: "WHT-0002-B",
            dateOfService: "2026-01-28T00:00:00.000+00:00",
            hospitalProvider: "Abuja Medical Center",
            description: "Regular checkup",
            status: "rejected",
            amount: 3000,
            reviewNotes: "Insufficient documentation",
            approvedAmount: 0,
            submittedDate: "2026-01-29T14:30:00.000+00:00",
            processedDate: "2026-01-30T09:15:00.000+00:00",
            documents: [],
            policy_number: null,
            diagnosis: null,
            referred_from_code: null,
            referred_from_name: null,
            referred_to_code: null,
            referred_to_name: null,
            created: null,
            source: null,
            $id: "697cf43c177a89d17ec8",
            $sequence: 3,
            $createdAt: "2026-01-29T14:30:00.000+00:00",
            $updatedAt: "2026-01-30T09:15:00.000+00:00",
            $permissions: ["read(\"user:WHT-0002-B\")", "update(\"user:WHT-0002-B\")", "delete(\"user:WHT-0002-B\")"],
            $databaseId: "main",
            $collectionId: "claims"
          }
        ];

        const foundClaim = mockClaims.find(claim => claim.$id === claimId);
        if (foundClaim) {
          // Transform single claim
          const transformedClaim = {
            id: foundClaim.$id,
            dateOfService: foundClaim.dateOfService,
            userId: foundClaim.userId,
            hospitalProvider: foundClaim.hospitalProvider,
            amount: typeof foundClaim.amount === 'string' ? parseFloat(foundClaim.amount) : foundClaim.amount,
            status: foundClaim.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
            patientName: `Patient ${foundClaim.userId}`,
            hmoId: foundClaim.userId,
            paCode: foundClaim.policy_number || 'N/A',
            dateSubmitted: foundClaim.submittedDate,
            notes: foundClaim.diagnosis || foundClaim.description,
            treatment: [] // Mock treatment data
          };

          return NextResponse.json({
            success: true,
            data: transformedClaim,
            message: "Claim retrieved successfully"
          }, { status: 200 });
        }

        return NextResponse.json({
          success: false,
          error: "Claim not found"
        }, { status: 404 });
      }

      // Fetch individual claim from backend
      const backendRes = await fetch(
        BACKEND_URL + `/admin/claims/${claimId}`,
        {
          headers: {
            ...getAdminHeaders(cookieHeader),
          },
          credentials: "include",
          next: { revalidate: 300 },
        }
      );

      if (!backendRes.ok) {
        return NextResponse.json({
          success: false,
          error: "Claim not found"
        }, { status: 404 });
      }

      const data = await backendRes.json();

      // Transform backend data for single claim
      let claim = null;
      if (data && typeof data === "object") {
        if (data.success && data.data) {
          // Handle different backend response formats
          if (data.data.claims && Array.isArray(data.data.claims)) {
            claim = data.data.claims.find((c: any) => c.$id === claimId || c.id === claimId);
          } else if (Array.isArray(data.data)) {
            claim = data.data.find((c: any) => c.$id === claimId || c.id === claimId);
          } else if (typeof data.data === 'object') {
            claim = data.data;
          } else {
            claim = data.data;
          }
        } else if (data.data && typeof data.data === 'object') {
          // Handle different backend response formats
          if (data.data.claims && Array.isArray(data.data.claims)) {
            claim = data.data.claims.find((c: any) => c.$id === claimId || c.id === claimId);
          } else if (Array.isArray(data.data)) {
            claim = data.data.find((c: any) => c.$id === claimId || c.id === claimId);
          } else {
            claim = data.data;
          }
        } else {
          claim = data;
        }
      }

      if (!claim) {
        return NextResponse.json({
          success: false,
          error: "Claim not found"
        }, { status: 404 });
      }

      // Transform claim to match frontend expectations
      const transformedClaim = {
        id: claim.$id || claim.id || claim._id,
        dateOfService: claim.dateOfService,
        userId: claim.userId,
        hospitalProvider: claim.hospitalProvider,
        amount: typeof claim.amount === 'string' ? parseFloat(claim.amount) : (claim.amount || 0),
        status: (claim.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected',
        patientName: claim.patientName || `Patient ${claim.userId || 'Unknown'}`,
        hmoId: claim.hmoId || claim.userId,
        paCode: claim.policy_number || claim.paCode,
        dateSubmitted: claim.submittedDate || claim.dateSubmitted,
        notes: claim.diagnosis || claim.description || claim.notes,
        treatment: claim.treatment || []
      };

      return NextResponse.json({
        success: true,
        data: transformedClaim,
        message: "Claim retrieved successfully"
      }, { status: 200 });
    }

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL environment variable');
      // Return mock data for development with proper structure
      const mockClaims = [
        {
          claimType: "Emergency Care",
          userId: "WHT-0001-A",
          dateOfService: "2026-01-30T00:00:00.000+00:00",
          hospitalProvider: "Minna General Hospital",
          description: "Emergency treatment",
          status: "pending",
          amount: 5000,
          reviewNotes: "",
          approvedAmount: null,
          submittedDate: "2026-01-30T16:22:13.305+00:00",
          processedDate: null,
          documents: [],
          policy_number: null,
          diagnosis: null,
          referred_from_code: null,
          referred_from_name: null,
          referred_to_code: null,
          referred_to_name: null,
          created: null,
          source: null,
          $id: "697ccca54a8611d1153f",
          $sequence: 1,
          $createdAt: "2026-01-30T15:22:15.014+00:00",
          $updatedAt: "2026-01-30T15:22:15.014+00:00",
          $permissions: ["read(\"user:WHT-0001-A\")", "update(\"user:WHT-0001-A\")", "delete(\"user:WHT-0001-A\")"],
          $databaseId: "main",
          $collectionId: "claims"
        },
        {
          claimType: "Maternity Care",
          userId: "WHT-0004-A",
          dateOfService: "2026-01-29T00:00:00.000+00:00",
          hospitalProvider: "Kaduna Teaching Hospital",
          description: "Maternity services",
          status: "approved",
          amount: 25000,
          reviewNotes: "Approved for full amount",
          approvedAmount: 25000,
          submittedDate: "2026-01-30T19:11:08.096+00:00",
          processedDate: "2026-01-31T10:00:00.000+00:00",
          documents: [],
          policy_number: null,
          diagnosis: null,
          referred_from_code: null,
          referred_from_name: null,
          referred_to_code: null,
          referred_to_name: null,
          created: null,
          source: null,
          $id: "697cf43c177a89d17ec7",
          $sequence: 2,
          $createdAt: "2026-01-30T18:11:08.902+00:00",
          $updatedAt: "2026-01-31T10:00:00.000+00:00",
          $permissions: ["read(\"user:WHT-0004-A\")", "update(\"user:WHT-0004-A\")", "delete(\"user:WHT-0004-A\")"],
          $databaseId: "main",
          $collectionId: "claims"
        },
        {
          claimType: "Outpatient Care",
          userId: "WHT-0002-B",
          dateOfService: "2026-01-28T00:00:00.000+00:00",
          hospitalProvider: "Abuja Medical Center",
          description: "Regular checkup",
          status: "rejected",
          amount: 3000,
          reviewNotes: "Insufficient documentation",
          approvedAmount: 0,
          submittedDate: "2026-01-29T14:30:00.000+00:00",
          processedDate: "2026-01-30T09:15:00.000+00:00",
          documents: [],
          policy_number: null,
          diagnosis: null,
          referred_from_code: null,
          referred_from_name: null,
          referred_to_code: null,
          referred_to_name: null,
          created: null,
          source: null,
          $id: "697cf43c177a89d17ec8",
          $sequence: 3,
          $createdAt: "2026-01-29T14:30:00.000+00:00",
          $updatedAt: "2026-01-30T09:15:00.000+00:00",
          $permissions: ["read(\"user:WHT-0002-B\")", "update(\"user:WHT-0002-B\")", "delete(\"user:WHT-0002-B\")"],
          $databaseId: "main",
          $collectionId: "claims"
        }
      ];

      // Transform data to match frontend expectations
      const transformedClaims = mockClaims.map(claim => ({
        id: claim.$id,
        dateOfService: claim.dateOfService,
        userId: claim.userId,
        hospitalProvider: claim.hospitalProvider,
        amount: typeof claim.amount === 'string' ? parseFloat(claim.amount) : claim.amount,
        status: claim.status.toLowerCase() as 'pending' | 'approved' | 'rejected',
        patientName: `Patient ${claim.userId}`, // Mock patient name
        hmoId: claim.userId, // Use userId as HMO ID for now
      }));

      // Apply search filter
      let filteredClaims = transformedClaims;
      if (search) {
        filteredClaims = transformedClaims.filter(claim =>
          claim.patientName?.toLowerCase().includes(search.toLowerCase()) ||
          claim.hospitalProvider.toLowerCase().includes(search.toLowerCase()) ||
          claim.status.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const paginatedClaims = filteredClaims.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        success: true,
        data: paginatedClaims,
        total: filteredClaims.length,
        message: "Claims list retrieved"
      }, { status: 200 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/admin/claims/",
      {
        headers: {
          ...getAdminHeaders(cookieHeader),
        },
        credentials: "include",
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!backendRes.ok) {
      // console.warn(`Backend returned ${backendRes.status} for admin claims`);
      // Return empty data if backend fails
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: "Claims list retrieved"
      }, { status: 200 });
    }

    const data = await backendRes.json();

    // Transform backend data to match frontend expectations
    let claims = [];
    let total = 0;

    if (data && typeof data === "object") {
      if (data.success && data.data) {
        // Backend returns { success: true, data: [...], total: n }
        claims = data.data;
        total = data.total || data.data.length;
      } else if (Array.isArray(data)) {
        // Backend returns array directly
        claims = data;
        total = data.length;
      } else if (data.data && Array.isArray(data.data)) {
        // Backend returns { data: [...] }
        claims = data.data;
        total = data.total || data.data.length;
      }
    }

    // Transform each claim to match frontend expectations
    const transformedClaims = claims.map((claim: any) => ({
      id: claim.$id || claim.id || claim._id,
      dateOfService: claim.dateOfService,
      userId: claim.userId,
      hospitalProvider: claim.hospitalProvider,
      amount: typeof claim.amount === 'string' ? parseFloat(claim.amount) : (claim.amount || 0),
      status: (claim.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected',
      patientName: claim.patientName || `Patient ${claim.userId || 'Unknown'}`,
      hmoId: claim.hmoId || claim.userId,
    }));

    // Apply search filter if provided
    let filteredClaims = transformedClaims;
    if (search) {
      filteredClaims = transformedClaims.filter((claim: { patientName: string; hospitalProvider: string; status: string; }) =>
        claim.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        claim.hospitalProvider.toLowerCase().includes(search.toLowerCase()) ||
        claim.status.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedClaims = filteredClaims.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedClaims,
      total: filteredClaims.length,
      message: "Claims list retrieved"
    }, { status: 200 });
  } catch (error: any) {
    // console.error('Admin claims GET error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin claims' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const guard = requireAdminRole(cookieHeader);
    if (guard) return guard;

    const body = await req.json();
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      // console.error('Missing BACKEND_URL environment variable');
      // Return mock success for development
      return NextResponse.json({
        success: true,
        data: {
          id: Date.now().toString(),
          ...body,
          status: "Pending",
          submittedDate: new Date().toISOString(),
          $id: `mock-${Date.now()}`,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString()
        },
        message: "Claim submitted successfully"
      }, { status: 201 });
    }

    const backendRes = await fetch(
      BACKEND_URL + "/admin/claims/",
      {
        method: 'POST',
        headers: {
          ...getAdminHeaders(cookieHeader),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    if (!backendRes.ok) {
      // console.warn(`Backend returned ${backendRes.status} for admin claims POST`);
    }

    const data = await backendRes.json();

    // Normalize response if wrapped in envelope
    if (data && typeof data === "object" && data.success && data.data) {
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(data || { success: true, data: [] }, { status: 200 });
  } catch (error: any) {
    // console.error('Admin claims POST error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin claim' },
      { status: 500 }
    );
  }
}