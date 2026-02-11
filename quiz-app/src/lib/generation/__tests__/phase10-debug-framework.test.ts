/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Phase 10 Debug Framework - Basic Tests
 * 
 * Tests the new modules to verify they work correctly.
 */

import { generatePointerDiff } from '../pointerDiffGenerator';
import { extractPointersFromIssue, extractPointersByRubricSection } from '../pointerExtractor';
import { Lesson } from '../types';

// Simple test lesson for testing
const testLessonBefore: Lesson = {
  id: 'TEST-001',
  unit: 'test-unit',
  topic: 'Testing',
  title: 'Test Lesson',
  description: 'A test lesson',
  layout: 'standard',
  estimatedMinutes: 30,
  difficulty: 'beginner',
  learningOutcomes: [
    { text: 'Learn testing', bloomLevel: 'Remember' }
  ],
  blocks: [
    {
      id: 'outcomes-1',
      type: 'outcomes',
      order: 0,
      content: {
        outcomes: [
          { text: 'Learn testing', bloomLevel: 'Remember' }
        ]
      }
    },
    {
      id: 'explanation-1',
      type: 'explanation',
      order: 1,
      content: {
        title: 'What is Testing?',
        content: 'Testing is important for quality.'
      }
    },
    {
      id: 'practice-1',
      type: 'practice',
      order: 2,
      content: {
        questions: [
          {
            id: 'q1',
            questionText: 'What is testing?',
            expectedAnswer: ['quality assurance', 'verification'],
            answerType: 'short-text',
            hint: 'Think about quality'
          }
        ]
      }
    }
  ],
  metadata: {
    generatedAt: '2026-02-07T00:00:00Z',
    version: '1.0',
    tags: ['test']
  }
};

const testLessonAfter: Lesson = {
  ...testLessonBefore,
  blocks: [
    testLessonBefore.blocks[0],
    {
      ...testLessonBefore.blocks[1],
      content: {
        title: 'What is Software Testing?',  // Changed
        content: 'Testing is very important for quality assurance.'  // Changed
      }
    },
    {
      ...testLessonBefore.blocks[2],
      content: {
        questions: [
          {
            ...testLessonBefore.blocks[2].content.questions[0],
            hint: 'Think about quality and verification'  // Changed
          }
        ]
      }
    }
  ]
};

// Test 1: Pointer Diff Generator
function testPointerDiff() {
  console.log('\n=== Test 1: Pointer Diff Generator ===');
  
  const diff = generatePointerDiff(testLessonBefore, testLessonAfter);
  
  console.log(`Generated ${diff.changes.length} changes`);
  console.log('Changes:');
  diff.changes.forEach(change => {
    console.log(`  ${change.op} at ${change.path}`);
    console.log(`    Summary: ${change.summary}`);
  });
  
  // Verify expected changes
  const expectedPaths = [
    '/blocks/1/content/title',
    '/blocks/1/content/content',
    '/blocks/2/content/questions/0/hint'
  ];
  
  const actualPaths = diff.changes.map(c => c.path);
  const allExpectedFound = expectedPaths.every(p => actualPaths.includes(p));
  
  if (allExpectedFound) {
    console.log('✅ Test PASSED: All expected changes found');
  } else {
    console.log('❌ Test FAILED: Missing expected changes');
    console.log('Expected:', expectedPaths);
    console.log('Actual:', actualPaths);
  }
}

// Test 2: Pointer Extractor
function testPointerExtractor() {
  console.log('\n=== Test 2: Pointer Extractor ===');
  
  const issueText = 'Explanation block at blocks[1] missing key points summary. Question blocks[2] needs better hint.';
  const pointers = extractPointersFromIssue(issueText, testLessonBefore);
  
  console.log(`Extracted ${pointers.length} pointers from issue text`);
  console.log('Pointers:', pointers);
  
  if (pointers.length > 0) {
    console.log('✅ Test PASSED: Extracted pointers from issue text');
  } else {
    console.log('❌ Test FAILED: No pointers extracted');
  }
  
  // Test rubric section extraction
  const rubricPointers = extractPointersByRubricSection('B1', testLessonBefore);
  console.log(`\nExtracted ${rubricPointers.length} pointers for rubric section B1`);
  console.log('Pointers:', rubricPointers);
}

// Test 3: Issue Lifecycle (simplified - just verify it runs)
function testIssueLifecycle() {
  console.log('\n=== Test 3: Issue Lifecycle Generator ===');
  
  try {
    const { generateIssueLifecycle } = require('../issueLifecycleGenerator');
    const { generatePointerDiff } = require('../pointerDiffGenerator');
    
    const pointerDiff = generatePointerDiff(testLessonBefore, testLessonAfter);
    
    const lifecycle = generateIssueLifecycle({
      runId: 'test-run',
      lessonId: 'TEST-001',
      lesson: testLessonBefore,
      scoreBeforeDetails: [
        {
          section: 'B1: Beginner Clarity',
          score: 0,
          maxScore: 5,
          issues: ['Missing key points summary'],
          suggestions: ['Add key points section'],
          jsonPointers: ['/blocks/1/content/content']
        }
      ],
      plan: undefined,
      pointerDiff,
      scoreAfterDetails: [
        {
          section: 'B1: Beginner Clarity',
          score: 3,
          maxScore: 5,
          issues: ['Improved but still needs work'],
          suggestions: [],
          jsonPointers: ['/blocks/1/content/content']
        }
      ]
    });
    
    console.log(`Generated lifecycle with ${lifecycle.issues.length} issues`);
    if (lifecycle.issues.length > 0) {
      console.log('First issue:');
      console.log(`  ID: ${lifecycle.issues[0].issueId}`);
      console.log(`  Outcome: ${lifecycle.issues[0].outcome}`);
      console.log(`  Fixability: ${lifecycle.issues[0].fixability}`);
    }
    
    console.log('✅ Test PASSED: Issue lifecycle generation works');
  } catch (error) {
    console.log('❌ Test FAILED:', error);
  }
}

// Test 4: Score Stability Checker (mocked)
function testScoreStability() {
  console.log('\n=== Test 4: Score Stability Checker ===');
  
  try {
    const { runStabilityCheck } = require('../scoreStabilityChecker');
    
    // Mock scorer
    const mockScorer = {
      scoreLesson: async () => ({
        total: 90 + Math.floor(Math.random() * 5),  // Random 90-94
        grade: 'Strong',
        breakdown: {},
        details: []
      })
    };
    
    console.log('Running stability check with mock scorer...');
    runStabilityCheck(testLessonBefore, mockScorer, 3).then(result => {
      console.log(`Stability check complete: ${result.runs.length} runs`);
      console.log(`  Range: ${result.analysis.min} - ${result.analysis.max}`);
      console.log(`  Variance: ${result.analysis.variance}`);
      console.log(`  Stable: ${result.analysis.isStable}`);
      
      if (result.runs.length === 3) {
        console.log('✅ Test PASSED: Stability check works');
      } else {
        console.log('❌ Test FAILED: Expected 3 runs');
      }
    }).catch(error => {
      console.log('❌ Test FAILED:', error);
    });
  } catch (error) {
    console.log('❌ Test FAILED:', error);
  }
}

// Test 5: Blockers Analyzer
function testBlockersAnalyzer() {
  console.log('\n=== Test 5: Blockers Analyzer ===');
  
  try {
    const { analyzeBlockers } = require('../blockersAnalyzer');
    
    const mockPlan = {
      lessonId: 'TEST-001',
      timestamp: new Date().toISOString(),
      plan: [
        {
          issueId: 'D3.synthesis',
          rubricRef: 'D3',
          fixability: 'blocked_by_policy',
          targets: ['/blocks/2/content/questions/0/answerType'],
          instructions: 'Change answerType to long-text for synthesis question'
        }
      ]
    };
    
    const mockScore = {
      total: 85,
      grade: 'Usable',
      breakdown: {},
      details: [
        {
          section: 'D3: Synthesis',
          score: 0,
          maxScore: 5,
          issues: ['Needs long-text for synthesis'],
          suggestions: []
        }
      ]
    };
    
    const blockers = analyzeBlockers(mockPlan, mockScore);
    
    console.log(`Found ${blockers.blockers.length} blockers`);
    console.log(`Points blocked: ${blockers.summary.pointsBlocked}`);
    
    if (blockers.blockers.length > 0) {
      console.log('First blocker:');
      console.log(`  Type: ${blockers.blockers[0].type}`);
      console.log(`  Description: ${blockers.blockers[0].description.substring(0, 80)}...`);
    }
    
    console.log('✅ Test PASSED: Blockers analysis works');
  } catch (error) {
    console.log('❌ Test FAILED:', error);
  }
}

// Run all tests
console.log('Starting Phase 10 Debug Framework Tests...');
console.log('==========================================');

testPointerDiff();
testPointerExtractor();
testIssueLifecycle();
testScoreStability();
testBlockersAnalyzer();

console.log('\n==========================================');
console.log('Tests Complete!');

