import { NextResponse } from 'next/server';
import { listGeneratedGuidedChunkFrames } from '@/lib/guidedChunk/generatedFrameStore';

export async function GET() {
  return NextResponse.json({
    frames: await listGeneratedGuidedChunkFrames(),
  });
}
