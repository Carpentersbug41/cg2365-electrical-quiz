/**
 * Test Debug Logging for Phase 10-13 Pipeline
 * 
 * Run with:
 *   DEBUG_PHASE10=true npx tsx scripts/testDebugLogging.ts
 * 
 * Or with full prompts:
 *   DEBUG_PHASE10=true DEBUG_PHASE10_PROMPTS=true npx tsx scripts/testDebugLogging.ts
 */

import fs from 'fs';
import path from 'path';
import { Phase10_Score } from '../src/lib/generation/phases/Phase10_Score';
import { Phase11_Suggest } from '../src/lib/generation/phases/Phase11_Suggest';
import { Phase12_Implement } from '../src/lib/generation/phases/Phase12_Implement';
import { Phase13_Rescore } from '../src/lib/generation/phases/Phase13_Rescore';
import { Lesson } from '../src/lib/generation/types';

/**
 * Load a test lesson
 */
function loadTestLesson(lessonId: string): Lesson {
  const lessonsDir = path.join(__dirname, '../src/data/lessons');
  const files = fs.readdirSync(lessonsDir);
  
  // Find lesson file by ID
  const lessonFile = files.find(f => f.startsWith(lessonId) || f.includes(lessonId));
  
  if (!lessonFile) {
    console.error(`❌ Lesson not found: ${lessonId}`);
    console.log(`Available lessons in ${lessonsDir}:`);
    files.forEach(f => console.log(`  - ${f}`));
    process.exit(1);
  }
  
  const lessonPath = path.join(lessonsDir, lessonFile);
  const lessonData = fs.readFileSync(lessonPath, 'utf-8');
  return JSON.parse(lessonData);
}

/**
 * Mock generate function for testing (returns dummy responses)
 */
async function mockGenerateFn(
  systemPrompt: string,
  userPrompt: string,
  mode: string,
  maxRetries: number = 2,
  attemptHigherLimit: boolean = false,
  tokenLimit: number = 8000,
  model: string = 'gemini-2.5-flash'
): Promise<string> {
  console.log(`\n[MockLLM] Called with mode: ${mode}, model: ${model}`);
  
  if (mode === 'score') {
    // Return a mock Phase 10 score
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
          'Difference between magnetic flux and flux density',
          'Magnetic effects of electrical currents',
          'Generating an A.C. supply',
          'Identify characteristics of sine-waves'
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
          excerpt: 'Magnetic flux is the total magnetic field passing through a given area.',
          problem: 'Definition is too terse for beginners',
          whyItMatters: 'Beginners need concrete examples and plain language',
          alignmentGap: 'AC1 requires clear explanation of flux vs flux density'
        },
        {
          id: 'ISSUE-2',
          category: 'teachingBeforeTesting',
          jsonPointers: ['/blocks/3/questions/0/question'],
          excerpt: 'What is the relationship between magnetic flux and current?',
          problem: 'Question asks about relationship before it is explained',
          whyItMatters: 'Teaching-before-testing principle violated',
          alignmentGap: 'AC3 content should precede AC3 questions'
        },
        {
          id: 'ISSUE-3',
          category: 'markingRobustness',
          jsonPointers: ['/blocks/3/questions/0/expectedAnswer'],
          excerpt: '["Current creates magnetic field"]',
          problem: 'Expected answer too vague',
          whyItMatters: 'LLM marker needs specific keywords',
          alignmentGap: 'AC3 requires specific wording'
        },
        {
          id: 'ISSUE-4',
          category: 'alignmentToLO',
          jsonPointers: ['/blocks/1/content/content'],
          excerpt: 'Electromagnetic induction is...',
          problem: 'Missing flux density distinction',
          whyItMatters: 'AC2 explicitly requires flux vs flux density',
          alignmentGap: 'AC2 not addressed'
        },
        {
          id: 'ISSUE-5',
          category: 'questionQuality',
          jsonPointers: ['/blocks/4/questions/0/question'],
          excerpt: 'Explain how AC is generated',
          problem: 'Overly broad question',
          whyItMatters: 'Question scope unclear',
          alignmentGap: 'AC4 needs structured breakdown'
        },
        {
          id: 'ISSUE-6',
          category: 'beginnerClarity',
          jsonPointers: ['/blocks/2/content/content'],
          excerpt: 'The sine wave represents...',
          problem: 'No diagram or visual aid mentioned',
          whyItMatters: 'Visual learners need diagrams',
          alignmentGap: 'AC5 characteristics better shown visually'
        },
        {
          id: 'ISSUE-7',
          category: 'markingRobustness',
          jsonPointers: ['/blocks/4/questions/1/expectedAnswer'],
          excerpt: '["Rotation", "Magnetic field"]',
          problem: 'Keywords too generic',
          whyItMatters: 'False positives likely',
          alignmentGap: 'AC4 needs precise terminology'
        },
        {
          id: 'ISSUE-8',
          category: 'teachingBeforeTesting',
          jsonPointers: ['/blocks/5/questions/0/question'],
          excerpt: 'Identify the peak voltage',
          problem: 'Peak voltage not defined earlier',
          whyItMatters: 'Term used before taught',
          alignmentGap: 'AC5 vocabulary gap'
        },
        {
          id: 'ISSUE-9',
          category: 'alignmentToLO',
          jsonPointers: ['/blocks/0/content/content'],
          excerpt: 'Magnetism is a force...',
          problem: 'AC1 attraction/repulsion not explicit',
          whyItMatters: 'Missing AC requirement',
          alignmentGap: 'AC1 not fully covered'
        },
        {
          id: 'ISSUE-10',
          category: 'questionQuality',
          jsonPointers: ['/blocks/5/questions/1/question'],
          excerpt: 'What factors affect frequency?',
          problem: 'Ambiguous wording',
          whyItMatters: 'Multiple interpretations possible',
          alignmentGap: 'AC5 needs clarity'
        }
      ],
      overallAssessment: 'Good foundation but needs clearer definitions for beginners and better teaching-before-testing. Marking rubrics need more specificity.'
    });
  }
  
  if (mode === 'phase') {
    // Return a mock Phase 11 suggestions
    return JSON.stringify({
      fixablePlans: [
        {
          issueId: 'ISSUE-1',
          targets: ['/blocks/0/content/content'],
          instructions: 'Expand definition with plain language example',
          patches: [
            {
              op: 'append',
              path: '/blocks/0/content/content',
              value: '\\n\\n**Magnetic Flux**: Think of it like the "strength" of magnetism passing through an area. Like how much water flows through a pipe - the flux is the total amount passing through.',
              find: ''
            }
          ]
        },
        {
          issueId: 'ISSUE-3',
          targets: ['/blocks/3/questions/0/expectedAnswer'],
          instructions: 'Add specific keywords',
          patches: [
            {
              op: 'replace',
              path: '/blocks/3/questions/0/expectedAnswer',
              value: ['Current flowing through a conductor creates a magnetic field around it', 'The magnetic field strength depends on current magnitude', 'Right-hand rule determines field direction'],
              find: ''
            }
          ]
        }
      ],
      blockedIssues: [
        {
          issueId: 'ISSUE-7',
          reason: 'Would require changing answerType',
          policyConflict: 'answerType changes are forbidden'
        }
      ],
      regenerationNeeded: false
    });
  }
  
  throw new Error(`Unknown mode: ${mode}`);
}

/**
 * Main test function
 */
async function testPipeline() {
  console.log('🚀 Testing Phase 10-13 Pipeline with Debug Logging\n');
  console.log(`DEBUG_PHASE10: ${process.env.DEBUG_PHASE10}`);
  console.log(`DEBUG_PHASE10_PROMPTS: ${process.env.DEBUG_PHASE10_PROMPTS}`);
  console.log(`DEBUG_PHASE10_TIMING: ${process.env.DEBUG_PHASE10_TIMING}\n`);
  
  // Load a test lesson
  // You can change this to any lesson ID
  const lessonId = '202-7B'; // or provide as command line arg
  console.log(`📖 Loading test lesson: ${lessonId}...\n`);
  
  const lesson = loadTestLesson(lessonId);
  console.log(`✅ Loaded: ${lesson.id} - ${lesson.title}\n`);
  
  // Phase 10: Score
  console.log('=' .repeat(80));
  console.log('PHASE 10: PEDAGOGICAL SCORING');
  console.log('=' .repeat(80));
  
  const scorer = new Phase10_Score();
  const score = await scorer.scoreLesson(lesson, mockGenerateFn);
  
  // Phase 11: Suggest
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 11: IMPROVEMENT SUGGESTIONS');
  console.log('=' .repeat(80));
  
  const suggester = new Phase11_Suggest();
  const suggestions = await suggester.generateSuggestions(
    lesson,
    score,
    scorer.lastSyllabusContext,
    mockGenerateFn
  );
  
  // Phase 12: Implement
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 12: IMPLEMENT IMPROVEMENTS');
  console.log('=' .repeat(80));
  
  const implementer = new Phase12_Implement();
  const implementation = await implementer.implementImprovements(
    lesson,
    suggestions
  );
  
  if (!implementation.success) {
    console.error('\n❌ Phase 12 failed:', implementation.error);
    return;
  }
  
  // Phase 13: Rescore
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 13: RESCORE & COMPARE');
  console.log('=' .repeat(80));
  
  const rescorer = new Phase13_Rescore();
  const result = await rescorer.rescoreAndCompare(
    lesson,
    implementation.candidateLesson!,
    score,
    scorer.lastSyllabusContext,
    mockGenerateFn,
    96  // threshold
  );
  
  // Final summary
  console.log('\n' + '='.repeat(80));
  console.log('FINAL RESULT');
  console.log('=' .repeat(80));
  console.log(`\n${result.accepted ? '✅ ACCEPTED' : '❌ REJECTED'}`);
  console.log(`Original Score: ${result.originalScore}/100`);
  console.log(`Candidate Score: ${result.candidateScore}/100`);
  console.log(`Improvement: ${result.improvement > 0 ? '+' : ''}${result.improvement} points`);
  console.log(`Reason: ${result.reason}\n`);
}

// Run the test
testPipeline().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
