import { NextRequest, NextResponse } from 'next/server';
import { MOCK_ENROLLEES } from '@/data/mockEnrollees';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hmoid = searchParams.get('hmoid');

  if (!hmoid) {
    return NextResponse.json(
      { error: 'HMOID parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Search for enrollee by HMOID
    const enrollee = MOCK_ENROLLEES.find(
      (e) => e.hmoid.toLowerCase() === hmoid.toLowerCase()
    );

    if (!enrollee) {
      return NextResponse.json(
        {
          error: 'Enrollee not found',
          message: 'Invalid HMOID! This ID is not a registered woothealth HMOID.',
        },
        { status: 404 }
      );
    }

    // Check if enrollee has valid plan (not expired)
    if (enrollee.status === 'expired') {
      return NextResponse.json(
        {
          error: 'Plan expired',
          message: 'This enrollee cannot access care',
          enrollee,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ enrollee });
  } catch (error) {
    console.error('Error verifying enrollee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
