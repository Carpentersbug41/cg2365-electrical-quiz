/**
 * Golden Set Tests
 * Automated regression tests for core tutor behaviors
 * These must pass 100% before deployment
 */

import { describe, it, expect, beforeAll } from 'vitest';
import type { NextRequest } from 'next/server';
import { POST as tutorHandler } from '@/app/api/tutor/route';
import { GOLDEN_SCENARIOS, INVARIANTS } from './scenarios';
import { createLessonContext } from '@/lib/tutor/groundingService';
import { extractBlockReferences } from '@/lib/tutor/groundingService';
import lesson202_3A from '@/data/lessons/202-3A-series-circuits.json';
import { Lesson } from '@/data/lessons/types';

// Helper to create a mock request
function createMockRequest(body: Record<string, unknown>): NextRequest {
  return new Request('http://localhost:3000/api/tutor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

// Helper to check if response is substantive
function isSubstantiveResponse(text: string): boolean {
  const contentWithoutWhitespace = text.replace(/\s+/g, ' ');
  return contentWithoutWhitespace.length >= 120;
}

// Skip tests if GEMINI_API_KEY is not set
const hasApiKey = !!process.env.GEMINI_API_KEY;
const skipMessage = 'Skipping: GEMINI_API_KEY not set';

describe('Golden Set Tests', () => {
  beforeAll(() => {
    if (!hasApiKey) {
      console.warn('\n⚠️  WARNING: GEMINI_API_KEY not set. Golden Set tests will be skipped.');
      console.warn('Set GEMINI_API_KEY in .env.local to run these tests.\n');
    }
  });

  describe('Core Invariants', () => {
    GOLDEN_SCENARIOS.forEach((scenario) => {
      it(`${scenario.id}: ${scenario.name}`, async () => {
        if (!hasApiKey) {
          console.log(`⏭️  ${skipMessage}`);
          return;
        }

        // Build lesson context
        const lessonContext = createLessonContext(
          lesson202_3A as Lesson,
          scenario.lessonContext.blocksToInclude
        );

        // Build request body
        const requestBody = {
          message: scenario.userMessage,
          mode: scenario.mode,
          lessonContext,
          questionContext: scenario.questionContext,
          history: [],
          userProgress: {
            attemptsOnCurrentQuestion: 0,
            lastAttemptWasCorrect: undefined,
            identifiedMisconceptions: [],
          },
        };

        // Make request
        const request = createMockRequest(requestBody);
        const response = await tutorHandler(request);
        const data = await response.json();

        // Check for errors
        if (!response.ok) {
          // Some scenarios might expect errors (e.g., grounding failures)
          if (data.requiresBlockSelection) {
            // This is expected for some grounding scenarios
            console.log(`✓ ${scenario.id}: Expected grounding failure`);
            return;
          }
          
          throw new Error(`API returned error: ${data.error || 'Unknown error'}`);
        }

        const tutorResponse = data.response;

        // INVARIANT 1: mustInclude checks
        if (scenario.expectedBehaviors.mustInclude) {
          scenario.expectedBehaviors.mustInclude.forEach((keyword) => {
            expect(
              tutorResponse.toLowerCase().includes(keyword.toLowerCase()),
              `Response should include "${keyword}" but didn't. Response: ${tutorResponse}`
            ).toBe(true);
          });
        }

        // INVARIANT 2: mustNotInclude checks
        if (scenario.expectedBehaviors.mustNotInclude) {
          scenario.expectedBehaviors.mustNotInclude.forEach((keyword) => {
            expect(
              !tutorResponse.toLowerCase().includes(keyword.toLowerCase()),
              `Response should NOT include "${keyword}" but did. Response: ${tutorResponse}`
            ).toBe(true);
          });
        }

        // INVARIANT 3: Block citations (grounding check)
        if (scenario.expectedBehaviors.mustCiteBlocks) {
          const blockRefs = extractBlockReferences(tutorResponse);
          
          if (isSubstantiveResponse(tutorResponse)) {
            expect(
              blockRefs.length > 0,
              `Substantive response must cite at least one block. Response: ${tutorResponse}`
            ).toBe(true);

            // Validate all cited blocks exist in lesson
            const allowedBlockIds = lessonContext.blocks.map(b => b.id);
            blockRefs.forEach((ref) => {
              expect(
                allowedBlockIds.includes(ref),
                `Invalid block reference: ${ref}`
              ).toBe(true);
            });
          }
        }

        // INVARIANT 4: Max length check
        if (scenario.expectedBehaviors.maxLength) {
          expect(
            tutorResponse.length <= scenario.expectedBehaviors.maxLength,
            `Response too long: ${tutorResponse.length} chars (max: ${scenario.expectedBehaviors.maxLength})`
          ).toBe(true);
        }

        // Log success
        console.log(`✓ ${scenario.id}: ${scenario.name}`);
      }, 30000); // 30 second timeout for API calls
    });
  });

  describe('Mode-Specific Invariants', () => {
    it('Check mode: No step-by-step solutions', async () => {
      if (!hasApiKey) {
        console.log(`⏭️  ${skipMessage}`);
        return;
      }

      const lessonContext = createLessonContext(lesson202_3A as Lesson);

      const request = createMockRequest({
        message: 'How do I solve this?',
        mode: 'check',
        lessonContext,
        history: [],
        userProgress: { attemptsOnCurrentQuestion: 0 },
      });

      const response = await tutorHandler(request);
      const data = await response.json();

      if (response.ok) {
        const tutorResponse = data.response.toLowerCase();
        
        // Should not contain step-by-step instruction phrases
        const forbiddenPhrases = [
          'step 1',
          'first,',
          'then,',
          'next,',
          'finally,',
          'the formula is',
        ];

        forbiddenPhrases.forEach((phrase) => {
          expect(
            !tutorResponse.includes(phrase),
            `Check mode should not include "${phrase}"`
          ).toBe(true);
        });
      }
    }, 30000);

    it('Teach mode: Requires attempt if attempts=0 and user asks for answer', async () => {
      if (!hasApiKey) {
        console.log(`⏭️  ${skipMessage}`);
        return;
      }

      const lessonContext = createLessonContext(lesson202_3A as Lesson);

      const request = createMockRequest({
        message: 'Just give me the answer',
        mode: 'teach',
        lessonContext,
        history: [],
        userProgress: { attemptsOnCurrentQuestion: 0 },
      });

      const response = await tutorHandler(request);
      const data = await response.json();

      // Should return early with "Have a go first" message
      expect(response.ok).toBe(true);
      expect(
        data.response.toLowerCase().includes('have a go') || 
        data.response.toLowerCase().includes('try') ||
        data.response.toLowerCase().includes('attempt')
      ).toBe(true);
    }, 30000);

    it('Grounding: Substantive responses must include valid block references', async () => {
      if (!hasApiKey) {
        console.log(`⏭️  ${skipMessage}`);
        return;
      }

      const lessonContext = createLessonContext(lesson202_3A as Lesson);

      const request = createMockRequest({
        message: 'Explain how series circuits work',
        mode: 'teach',
        lessonContext,
        history: [],
        userProgress: { attemptsOnCurrentQuestion: 0 },
      });

      const response = await tutorHandler(request);
      const data = await response.json();

      if (response.ok && isSubstantiveResponse(data.response)) {
        const blockRefs = extractBlockReferences(data.response);
        
        // Must have at least one block reference
        expect(
          blockRefs.length > 0,
          'Substantive response about lesson content must cite blocks'
        ).toBe(true);

        // All references must be valid
        const allowedBlockIds = lessonContext.blocks.map(b => b.id);
        blockRefs.forEach((ref) => {
          expect(allowedBlockIds.includes(ref)).toBe(true);
        });
      }
    }, 30000);
  });

  describe('Assessment Lock', () => {
    it('Assessment context: Only check mode allowed', async () => {
      if (!hasApiKey) {
        console.log(`⏭️  ${skipMessage}`);
        return;
      }

      const lessonContext = createLessonContext(lesson202_3A as Lesson);

      // Try teach mode in assessment context - should be rejected
      const request = createMockRequest({
        message: 'Help me',
        mode: 'teach',
        contextType: 'assessment',
        lessonContext,
        history: [],
        userProgress: { attemptsOnCurrentQuestion: 0 },
      });

      const response = await tutorHandler(request);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
      expect(data.error.toLowerCase()).toContain('check');
    }, 30000);
  });
});

describe('Invariant Definitions', () => {
  it('All invariants are documented', () => {
    // This test ensures we don't forget to document new invariants
    const documentedInvariants = Object.keys(INVARIANTS);
    expect(documentedInvariants.length).toBeGreaterThan(0);
    
    // Check that all scenarios reference valid invariants
    GOLDEN_SCENARIOS.forEach((scenario) => {
      scenario.invariants.forEach((invariant) => {
        expect(
          documentedInvariants.includes(invariant),
          `Scenario ${scenario.id} references undocumented invariant: ${invariant}`
        ).toBe(true);
      });
    });
  });
});


