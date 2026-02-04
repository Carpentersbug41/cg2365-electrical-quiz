/**
 * Phase 9: Assembler
 * Assembles all phase outputs into a complete lesson JSON
 */

import { Lesson } from '../types';
import { PlanningOutput } from './Phase1_Planning';
import { VocabularyOutput } from './Phase2_Vocabulary';
import { ExplanationOutput } from './Phase3_Explanation';
import { UnderstandingChecksOutput } from './Phase4_UnderstandingChecks';
import { WorkedExampleOutput } from './Phase5_WorkedExample';
import { PracticeOutput } from './Phase6_Practice';
import { IntegrationOutput } from './Phase7_Integration';
import { SpacedReviewOutput } from './Phase8_SpacedReview';

export interface AssemblerInput {
  lessonId: string;
  title: string;
  description: string;
  topic: string;
  unit: string;
  prerequisites?: string[];
  youtubeUrl?: string;
  imageUrl?: string;
  plan: PlanningOutput;
  vocabulary: VocabularyOutput;
  explanations: ExplanationOutput;
  checks: UnderstandingChecksOutput;
  workedExample: WorkedExampleOutput;
  practice: PracticeOutput;
  integration: IntegrationOutput;
  spacedReview: SpacedReviewOutput;
}

export class Phase9_Assembler {
  /**
   * Assemble all phase outputs into complete lesson JSON
   */
  assemble(input: AssemblerInput): Lesson {
    const {
      lessonId,
      title,
      description,
      topic,
      unit,
      prerequisites,
      youtubeUrl,
      imageUrl,
      plan,
      vocabulary,
      explanations,
      checks,
      workedExample,
      practice,
      integration,
      spacedReview,
    } = input;

    // Build blocks array (orders will be reassigned sequentially)
    const blocks: any[] = [];
    let currentOrder = 1;

    // 1. Outcomes block
    blocks.push({
      id: `${lessonId}-outcomes`,
      type: 'outcomes',
      order: currentOrder++,
      content: {
        outcomes: plan.learningOutcomes.map((outcome, idx) => ({
          text: outcome,
          bloomLevel: this.inferBloomLevel(outcome, idx),
        })),
      },
    });

    // 2. Vocab block
    blocks.push({
      id: `${lessonId}-vocab`,
      type: 'vocab',
      order: currentOrder++,
      content: {
        terms: vocabulary.terms,
      },
    });

    // 3. Diagram block - if needed
    if (plan.needsDiagram) {
      blocks.push({
        id: `${lessonId}-diagram`,
        type: 'diagram',
        order: currentOrder++,
        content: {
          title: `${topic} Diagram`,
          description: `Visual representation of ${topic}`,
          videoUrl: youtubeUrl || '',
          imageUrl: imageUrl || undefined,
          diagramType: this.inferDiagramType(topic),
          elementIds: [],
          placeholderText: `Diagram showing ${topic}`,
        },
      });
    }

    // 4. Explanation blocks (reassign orders sequentially)
    explanations.explanations.forEach((exp) => {
      blocks.push({
        id: exp.id,
        type: 'explanation',
        order: currentOrder++,
        content: {
          title: exp.title,
          content: exp.content,
        },
      });
    });

    // 5. Understanding check blocks (reassign orders sequentially)
    checks.checks.forEach((check) => {
      blocks.push({
        id: check.id,
        type: 'practice',
        order: currentOrder++,
        content: {
          title: check.title,
          mode: check.mode,
          sequential: check.sequential,
          questions: check.questions,
        },
      });
    });

    // 6. Worked example block (if exists)
    if (workedExample.workedExample) {
      blocks.push({
        id: workedExample.workedExample.id,
        type: 'worked-example',
        order: currentOrder++,
        content: {
          title: workedExample.workedExample.title,
          given: workedExample.workedExample.given,
          steps: workedExample.workedExample.steps,
          notes: workedExample.workedExample.notes,
        },
      });
    }

    // 7. Guided practice block (if exists)
    if (workedExample.guidedPractice) {
      blocks.push({
        id: workedExample.guidedPractice.id,
        type: 'guided-practice',
        order: currentOrder++,
        content: {
          title: workedExample.guidedPractice.title,
          problem: workedExample.guidedPractice.problem,
          steps: workedExample.guidedPractice.steps,
        },
      });
    }

    // 8. Practice block
    blocks.push({
      id: practice.practice.id,
      type: 'practice',
      order: currentOrder++,
      content: {
        title: practice.practice.title,
        questions: practice.practice.questions,
      },
    });

    // 9. Integrative block
    blocks.push({
      id: integration.integrative.id,
      type: 'practice',
      order: currentOrder++,
      content: {
        title: integration.integrative.title,
        mode: integration.integrative.mode,
        sequential: integration.integrative.sequential,
        questions: integration.integrative.questions,
      },
    });

    // 10. Spaced review block (ALWAYS LAST)
    blocks.push({
      id: spacedReview.spacedReview.id,
      type: 'spaced-review',
      order: currentOrder++,
      content: {
        title: spacedReview.spacedReview.title,
        questions: spacedReview.spacedReview.questions,
        notes: spacedReview.spacedReview.notes,
      },
    });

    // Blocks are already in correct order, no need to sort
    // Validate block order uniqueness (should always pass now)
    this.validateBlockOrders(blocks);

    // Build complete lesson
    const lesson: Lesson = {
      id: lessonId,
      title,
      description,
      layout: plan.layout,
      unit,
      topic,
      learningOutcomes: plan.learningOutcomes,
      prerequisites: prerequisites || [],
      blocks,
      metadata: {
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0],
        version: '1.0',
        author: 'C&G 2365 Learning Team',
        ...(youtubeUrl && { youtubeUrl }),
      },
    };

    return lesson;
  }

  /**
   * Infer Bloom level from outcome text
   */
  private inferBloomLevel(outcome: string, index: number): string {
    const lower = outcome.toLowerCase();
    
    if (lower.includes('define') || lower.includes('list') || lower.includes('state') || lower.includes('identify')) {
      return 'remember';
    }
    if (lower.includes('explain') || lower.includes('describe') || lower.includes('summarize') || lower.includes('compare')) {
      return 'understand';
    }
    if (lower.includes('calculate') || lower.includes('solve') || lower.includes('demonstrate') || lower.includes('apply')) {
      return 'apply';
    }
    
    // Default based on position
    if (index === 0) return 'remember';
    if (index === 1) return 'understand';
    return 'apply';
  }

  /**
   * Infer diagram type from topic
   */
  private inferDiagramType(topic: string): string {
    const lower = topic.toLowerCase();
    
    if (lower.includes('circuit') || lower.includes('series') || lower.includes('parallel')) {
      return 'circuit';
    }
    if (lower.includes('wiring') || lower.includes('installation')) {
      return 'wiring';
    }
    if (lower.includes('plan') || lower.includes('layout')) {
      return 'plan';
    }
    if (lower.includes('procedure') || lower.includes('process') || lower.includes('steps')) {
      return 'procedure';
    }
    if (lower.includes('schematic')) {
      return 'schematic';
    }
    if (lower.includes('graph') || lower.includes('chart')) {
      return 'graph';
    }
    
    return 'concept';
  }

  /**
   * Validate that all block orders are unique
   */
  private validateBlockOrders(blocks: any[]): void {
    const orders = blocks.map(b => b.order);
    const uniqueOrders = new Set(orders);
    
    if (orders.length !== uniqueOrders.size) {
      const duplicates = orders.filter((order, index) => orders.indexOf(order) !== index);
      throw new Error(
        `Block order collision detected: Duplicate orders [${duplicates.join(', ')}]. ` +
        `Each block must have a unique order value.`
      );
    }
    
    // Validate monotonic increasing
    for (let i = 1; i < orders.length; i++) {
      if (orders[i] <= orders[i - 1]) {
        throw new Error(
          `Block order must be strictly increasing: ` +
          `Block ${i} (order ${orders[i]}) is not greater than Block ${i - 1} (order ${orders[i - 1]})`
        );
      }
    }
  }
}
