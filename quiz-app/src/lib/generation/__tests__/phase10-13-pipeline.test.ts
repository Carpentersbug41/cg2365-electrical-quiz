/**
 * Integration Tests for Phase 10-13 Pipeline
 * 
 * Tests the full pedagogical scoring and improvement pipeline:
 * Phase 10: Score → Phase 11: Suggest → Phase 12: Implement → Phase 13: Rescore
 */

import { describe, test, expect } from '@jest/globals';
import { Phase10_Score } from '../phases/Phase10_Score';
import { Phase11_Suggest } from '../phases/Phase11_Suggest';
import { Phase12_Implement } from '../phases/Phase12_Implement';
import { Phase13_Rescore } from '../phases/Phase13_Rescore';
import { Lesson } from '../types';
import { retrieveSyllabusContext } from '@/lib/syllabus/syllabusRAG';

// Mock generateFn for testing
const mockGenerateFn = async (
  systemPrompt: string,
  userPrompt: string,
  type: string,
  maxRetries: number,
  attemptHigherLimit: boolean,
  tokenLimit: number,
  model: string
) => {
  // Return mock responses based on type
  if (type === 'score') {
    // Mock Phase 10 score response
    return JSON.stringify({
      total: 85,
      grade: 'Usable',
      syllabus: {
        unit: '202',
        unitTitle: 'Principles of Electrical Science',
        learningOutcome: 'LO5',
        loTitle: 'Magnetism and electricity relationship',
        assessmentCriteria: [
          'Effects of magnetism (attraction/repulsion)',
          'Difference between magnetic flux and flux density'
        ]
      },
      breakdown: {
        beginnerClarity: 24,
        teachingBeforeTesting: 18,
        markingRobustness: 16,
        alignmentToLO: 12,
        questionQuality: 8
      },
      issues: [
        {
          id: 'ISSUE-1',
          category: 'beginnerClarity',
          jsonPointers: ['/blocks/0/content/content'],
          excerpt: 'Magnetic flux is...',
          problem: 'Definition is too terse',
          whyItMatters: 'Beginners need more context',
          alignmentGap: 'Needs to match AC1 wording'
        },
        {
          id: 'ISSUE-2',
          category: 'teachingBeforeTesting',
          jsonPointers: ['/blocks/3/content/questions/0/questionText'],
          excerpt: 'What is flux density?',
          problem: 'Question asked before concept explained',
          whyItMatters: 'Violates teaching-before-testing',
        },
        {
          id: 'ISSUE-3',
          category: 'markingRobustness',
          jsonPointers: ['/blocks/3/content/questions/0/expectedAnswer'],
          excerpt: '["flux density"]',
          problem: 'Too vague for short-text',
          whyItMatters: 'Hard to grade accurately',
        },
        // Add 7 more issues to reach 10
        ...Array.from({ length: 7 }, (_, i) => ({
          id: `ISSUE-${i + 4}`,
          category: 'questionQuality' as const,
          jsonPointers: [`/blocks/5/content/questions/${i}/questionText`],
          excerpt: `Question ${i}`,
          problem: `Minor issue ${i}`,
          whyItMatters: `Polish needed`,
        }))
      ],
      overallAssessment: 'Good foundation but needs polish on beginner clarity and teaching sequence.'
    });
  } else if (type === 'phase') {
    // Mock Phase 11 suggestions response
    return JSON.stringify({
      fixablePlans: [
        {
          issueId: 'ISSUE-1',
          targets: ['/blocks/0/content/content'],
          instructions: 'Add clearer definition of magnetic flux',
          patches: [
            {
              op: 'append',
              path: '/blocks/0/content/content',
              value: '\n\n**Magnetic Flux**: Total magnetic field passing through a given area.'
            }
          ]
        },
        {
          issueId: 'ISSUE-2',
          targets: ['/blocks/1/content/content'],
          instructions: 'Add explanation of flux density before question',
          patches: [
            {
              op: 'append',
              path: '/blocks/1/content/content',
              value: '\n\n**Flux Density** (B): Concentration of magnetic flux per unit area, measured in Tesla (T).'
            }
          ]
        },
        {
          issueId: 'ISSUE-3',
          targets: ['/blocks/3/content/questions/0/expectedAnswer'],
          instructions: 'Make expectedAnswer more specific',
          patches: [
            {
              op: 'replace',
              path: '/blocks/3/content/questions/0/expectedAnswer',
              from: '["flux density"]',
              value: '["magnetic flux per unit area", "measured in Tesla", "symbol B", "concentration of flux"]'
            }
          ]
        }
      ],
      blockedIssues: [],
      regenerationNeeded: false
    });
  }
  
  return '{}';
};

// Simple test lesson
const createTestLesson = (): Lesson => ({
  id: '202-5A-magnetism-test',
  title: 'Magnetism Basics',
  description: 'Introduction to magnetism and magnetic fields',
  unit: '202',
  topic: 'Magnetism',
  layout: 'standard',
  blocks: [
    {
      id: '202-5A-1',
      type: 'explanation',
      order: 0,
      content: {
        title: 'Magnetic Flux',
        content: 'Magnetic flux is the total field.',
        bloomLevel: 'understand'
      }
    },
    {
      id: '202-5A-2',
      type: 'explanation',
      order: 1,
      content: {
        title: 'Flux Density',
        content: 'Basic info about flux density.',
        bloomLevel: 'understand'
      }
    },
    {
      id: '202-5A-3',
      type: 'practice',
      order: 2,
      content: {
        title: 'Check Understanding',
        questions: [
          {
            id: '202-5A-q1',
            questionText: 'What is flux density?',
            answerType: 'short-text',
            expectedAnswer: ['flux density'],
            bloomLevel: 'remember',
            marks: 2
          }
        ]
      }
    }
  ],
  metadata: {
    version: 1,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    estimatedDuration: 10,
    difficulty: 'beginner'
  }
});

describe('Phase 10-13 Pipeline Integration', () => {
  test('Phase 10: Score lesson with syllabus context', async () => {
    const scorer = new Phase10_Score();
    const lesson = createTestLesson();
    
    const score = await scorer.scoreLesson(lesson, mockGenerateFn);
    
    expect(score).toBeDefined();
    expect(score.total).toBe(85);
    expect(score.grade).toBe('Usable');
    expect(score.issues).toHaveLength(10);
    expect(score.syllabus.unit).toBe('202');
  });
  
  test('Phase 11: Generate fix suggestions', async () => {
    const suggester = new Phase11_Suggest();
    const lesson = createTestLesson();
    
    // First score the lesson
    const scorer = new Phase10_Score();
    const score = await scorer.scoreLesson(lesson, mockGenerateFn);
    
    // Then generate suggestions
    const syllabusContext = await retrieveSyllabusContext(lesson.id, lesson.title, lesson.description);
    const suggestions = await suggester.generateSuggestions(
      lesson,
      score,
      syllabusContext,
      mockGenerateFn
    );
    
    expect(suggestions).toBeDefined();
    expect(suggestions.fixablePlans).toHaveLength(3);
    expect(suggestions.blockedIssues).toHaveLength(0);
    expect(suggestions.regenerationNeeded).toBe(false);
  });
  
  test('Phase 12: Implement improvements', async () => {
    const implementer = new Phase12_Implement();
    const lesson = createTestLesson();
    
    // Get suggestions
    const suggester = new Phase11_Suggest();
    const scorer = new Phase10_Score();
    const score = await scorer.scoreLesson(lesson, mockGenerateFn);
    const syllabusContext = await retrieveSyllabusContext(lesson.id, lesson.title, lesson.description);
    const suggestions = await suggester.generateSuggestions(
      lesson,
      score,
      syllabusContext,
      mockGenerateFn
    );
    
    // Implement patches
    const result = await implementer.implementImprovements(lesson, suggestions);
    
    expect(result.success).toBe(true);
    expect(result.candidateLesson).toBeDefined();
    expect(result.patchesApplied).toBe(3);
    
    // Verify patches were applied
    const candidate = result.candidateLesson!;
    expect(candidate.blocks[0].content.content).toContain('Magnetic Flux');
    expect(candidate.blocks[1].content.content).toContain('Flux Density');
  });
  
  test('Phase 13: Rescore and compare', async () => {
    const rescorer = new Phase13_Rescore();
    const lesson = createTestLesson();
    
    // Full pipeline
    const scorer = new Phase10_Score();
    const suggester = new Phase11_Suggest();
    const implementer = new Phase12_Implement();
    
    const originalScore = await scorer.scoreLesson(lesson, mockGenerateFn);
    const syllabusContext = await retrieveSyllabusContext(lesson.id, lesson.title, lesson.description);
    const suggestions = await suggester.generateSuggestions(
      lesson,
      originalScore,
      syllabusContext,
      mockGenerateFn
    );
    const implementation = await implementer.implementImprovements(lesson, suggestions);
    
    expect(implementation.success).toBe(true);
    
    // Rescore candidate
    const result = await rescorer.rescoreAndCompare(
      lesson,
      implementation.candidateLesson!,
      originalScore,
      syllabusContext,
      mockGenerateFn,
      96  // threshold
    );
    
    expect(result).toBeDefined();
    expect(result.originalScore).toBe(85);
    expect(result.candidateScore).toBeDefined();
    expect(result.improvement).toBeDefined();
  });
  
  test('Full pipeline: Score → Suggest → Implement → Rescore', async () => {
    const lesson = createTestLesson();
    
    // Phase 10: Score
    console.log('\n=== Phase 10: Scoring ===');
    const scorer = new Phase10_Score();
    const originalScore = await scorer.scoreLesson(lesson, mockGenerateFn);
    console.log(`Original score: ${originalScore.total}/100`);
    expect(originalScore.issues).toHaveLength(10);
    
    // Check if already meets threshold
    if (originalScore.total >= 96) {
      console.log('✅ Already meets threshold - skip improvement');
      return;
    }
    
    // Phase 11: Suggest
    console.log('\n=== Phase 11: Suggesting Improvements ===');
    const suggester = new Phase11_Suggest();
    const syllabusContext = await retrieveSyllabusContext(lesson.id, lesson.title, lesson.description);
    const suggestions = await suggester.generateSuggestions(
      lesson,
      originalScore,
      syllabusContext,
      mockGenerateFn
    );
    console.log(`Fixable plans: ${suggestions.fixablePlans.length}`);
    expect(suggestions.fixablePlans.length).toBeGreaterThan(0);
    
    // Phase 12: Implement
    console.log('\n=== Phase 12: Implementing Improvements ===');
    const implementer = new Phase12_Implement();
    const implementation = await implementer.implementImprovements(lesson, suggestions);
    expect(implementation.success).toBe(true);
    console.log(`Patches applied: ${implementation.patchesApplied}`);
    
    // Phase 13: Rescore
    console.log('\n=== Phase 13: Rescoring ===');
    const rescorer = new Phase13_Rescore();
    const result = await rescorer.rescoreAndCompare(
      lesson,
      implementation.candidateLesson!,
      originalScore,
      syllabusContext,
      mockGenerateFn,
      96
    );
    
    console.log(`Candidate score: ${result.candidateScore}/100`);
    console.log(`Improvement: ${result.improvement >= 0 ? '+' : ''}${result.improvement}`);
    console.log(`Decision: ${result.accepted ? '✅ ACCEPT' : '❌ REJECT'}`);
    console.log(`Reason: ${result.reason}`);
    
    expect(result.finalLesson).toBeDefined();
  });
});
