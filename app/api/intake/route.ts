import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, replace with Supabase or your database
const cases = new Map<string, any>();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const caseId = searchParams.get('case_id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    const caseData = cases.get(caseId);

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(caseData);
  } catch (error) {
    console.error('Get case error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Generate a unique case ID
    const caseId = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store case data
    cases.set(caseId, {
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending',
    });

    return NextResponse.json({ caseId });
  } catch (error) {
    console.error('Create case error:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
