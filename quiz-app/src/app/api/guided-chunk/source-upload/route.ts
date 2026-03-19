import { NextRequest, NextResponse } from 'next/server';
import { cleanExtractedText, extractTextFromDocxBuffer, extractTextFromPdfBuffer } from '@/lib/module_planner/syllabus';
import { guardV2AdminAccess } from '@/lib/v2/admin/api';

function detectFileType(filename: string): 'pdf' | 'docx' | 'txt' | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.txt')) return 'txt';
  return null;
}

async function extractTextFromUpload(file: File): Promise<{ extractedText: string; fileType: 'pdf' | 'docx' | 'txt' }> {
  const filename = file.name || 'upload.txt';
  const fileType = detectFileType(filename);
  if (!fileType) {
    throw new Error('Unsupported file type. Upload PDF, DOCX, or TXT.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (fileType === 'txt') {
    return { extractedText: buffer.toString('utf8'), fileType };
  }
  if (fileType === 'pdf') {
    return { extractedText: await extractTextFromPdfBuffer(buffer), fileType };
  }
  return { extractedText: await extractTextFromDocxBuffer(buffer), fileType };
}

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request, 'content_operator');
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required (multipart/form-data).' }, { status: 400 });
    }

    const { extractedText, fileType } = await extractTextFromUpload(file);
    const cleanedText = cleanExtractedText(extractedText);
    if (!cleanedText || cleanedText.length < 20) {
      return NextResponse.json(
        { error: `Failed to extract readable text from ${file.name}.` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      fileType,
      extractedChars: cleanedText.length,
      text: cleanedText,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract source text.' },
      { status: 500 }
    );
  }
}
