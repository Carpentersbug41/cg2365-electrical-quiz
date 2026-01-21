/**
 * Diagnostic Analysis API Route
 * Uses LLM to analyze failed diagnostic results and generate personalized study plans
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { getMisconception } from '@/lib/marking/misconceptionCodes';
import { DiagnosticAnalysisRequest, StudyPlan } from '@/lib/diagnostic/types';
import { createLLMClientWithFallback } from '@/lib/llm/client';

// Initialize LLM client (will be created on first request with fallback support)
let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

export async function POST(request: NextRequest) {
  try {
    const body: DiagnosticAnalysisRequest = await request.json();
    const { misconceptions, score, wrongQuestions, lessonId } = body;

    // Validate input
    if (!lessonId || score === undefined || !wrongQuestions) {
      return NextResponse.json(
        { error: 'Invalid request: missing required fields' },
        { status: 400 }
      );
    }

    // Build misconception context
    const misconceptionDetails = misconceptions
      .filter(Boolean)
      .map(code => {
        try {
          const misc = getMisconception(code);
          return `- ${code}: ${misc.description}`;
        } catch {
          return `- ${code}`;
        }
      })
      .join('\n');

    // Build question topics summary
    const topicsSummary = wrongQuestions
      .map(q => q.tags.join(', '))
      .filter(Boolean)
      .join('; ');

    // Create LLM prompt
    const prompt = `You are analyzing a diagnostic test result for a C&G 2365 Level 2 Electrical trainee.

CONTEXT:
- Prerequisite lesson: ${lessonId}
- Score: ${Math.round(score * 100)}% (failed - need 80%)
- Wrong questions: ${wrongQuestions.length}

MISCONCEPTIONS DETECTED:
${misconceptionDetails || 'None identified'}

WRONG QUESTION TOPICS:
${topicsSummary || 'Various topics'}

YOUR TASK:
Explain WHY they got questions wrong and what conceptual gaps exist.

Provide:

1. **Why You Got These Wrong** (2-3 sentences): Explain the pattern in their mistakes. What conceptual misunderstanding or gap led to these errors?
   Example: "You're mixing up series and parallel circuit rules. When you see resistors in series, you're trying to use parallel formulas instead."
   
2. **What You Need to Understand** (2-3 key concepts):
   - Use format: "Concept: Brief explanation"
   - Examples: "Series circuits: Current stays the same through all components"
   - Focus on the specific misunderstanding, not just general topics
   - Order by importance (most critical gap first)

3. **Quick Fix** (1 sentence): The ONE thing to focus on first that will prevent these mistakes.

IMPORTANT:
- Focus on WHY they made mistakes, not just WHAT to study
- Be specific about the conceptual gap or misunderstanding
- Use clear, encouraging language
- Reference general C&G 2365 topics, not specific lesson IDs

Format your response as JSON:
{
  "whyWrong": "Clear explanation of the pattern in their mistakes...",
  "keyConceptsToUnderstand": [
    {
      "concept": "Series Circuit Rules",
      "explanation": "Brief clear explanation of what they need to understand"
    }
  ],
  "quickFix": "The one thing to focus on first..."
}`;

    // Initialize LLM client if not already initialized
    if (!llmClientPromise) {
      llmClientPromise = createLLMClientWithFallback();
    }

    const client = await llmClientPromise;
    const model = client.getGenerativeModel({ 
      model: getGeminiModelWithDefault(),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const responseText = result.response.text();
    
    // Parse JSON response
    // Remove markdown code blocks if present
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let studyPlan: StudyPlan;
    try {
      studyPlan = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', cleanJson);
      
      // Fallback: create a basic study plan
      studyPlan = {
        whyWrong: `You got ${wrongQuestions.length} questions wrong, indicating some gaps in understanding the prerequisite concepts.`,
        keyConceptsToUnderstand: [
          {
            concept: 'Review Core Concepts',
            explanation: 'Go through the fundamental principles and formulas systematically'
          },
          {
            concept: 'Practice Application',
            explanation: 'Work through more examples to see how concepts are applied'
          }
        ],
        quickFix: 'Focus on understanding the basic formulas and when to apply them.'
      };
    }

    // Validate and sanitize response
    if (!studyPlan.whyWrong || !studyPlan.keyConceptsToUnderstand || !studyPlan.quickFix) {
      throw new Error('Invalid study plan structure from LLM');
    }

    return NextResponse.json({
      studyPlan
    });

  } catch (error) {
    console.error('Diagnostic analysis error:', error);
    
    // Return a helpful fallback response
    return NextResponse.json({
      studyPlan: {
        whyWrong: 'We encountered an issue generating personalized analysis, but reviewing the prerequisite lessons will help strengthen your understanding.',
        keyConceptsToUnderstand: [
          {
            concept: 'Review Prerequisite Material',
            explanation: 'Go through the lessons systematically to fill knowledge gaps'
          }
        ],
        quickFix: 'Start by reviewing the basic definitions and formulas.'
      }
    }, { status: 200 }); // Return 200 with fallback instead of error
  }
}

// Add CORS headers if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
