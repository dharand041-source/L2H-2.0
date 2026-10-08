import { NextRequest, NextResponse } from 'next/server';
import { executeCodeSafely, CodeExecutionRequest } from '@/lib/execution/sandbox-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: CodeExecutionRequest = await request.json();

    if (!body || !body.code) {
      return NextResponse.json(
        { error: 'Code submission body is required.' },
        { status: 400 }
      );
    }

    const result = await executeCodeSafely(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Code execution endpoint exception:', error);
    return NextResponse.json(
      {
        status: 'UNAVAILABLE',
        error: 'Code execution service is temporarily unavailable.',
        testCasesPassed: 0,
        totalTestCases: 0,
        executionTimeMs: 0,
        output: '',
        tests: [],
      },
      { status: 500 }
    );
  }
}
