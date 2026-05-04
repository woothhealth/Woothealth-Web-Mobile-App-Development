import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ENROLLEES } from '@/data/mockEnrollees';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 10;

    let filtered = MOCK_ENROLLEES;

    // Filter by search term if provided
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (enrollee) =>
          enrollee.firstName.toLowerCase().includes(term) ||
          enrollee.lastName.toLowerCase().includes(term) ||
          enrollee.hmoid.toLowerCase().includes(term) ||
          enrollee.plan.toLowerCase().includes(term)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEnrollees = filtered.slice(startIndex, endIndex);

    return NextResponse.json({
      enrollees: paginatedEnrollees,
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    });
  } catch (error) {
    console.error('Error fetching enrollees:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
