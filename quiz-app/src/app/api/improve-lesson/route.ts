/**
 * Improve Lesson API Route
 * TODO: Update to use new Phase 10-13 pipeline
 * CURRENTLY DISABLED - needs refactoring to use new modular phases
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'The improve-lesson API is currently disabled. It needs to be updated to use the new Phase 10-13 pipeline.',
    },
    { status: 501 } // 501 Not Implemented
  );
}
