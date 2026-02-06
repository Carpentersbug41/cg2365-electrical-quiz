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
   * 
   * CONTRACT: Block orders MUST follow this pattern:
   * 1 = outcomes
   * 2 = vocab
   * 3 = diagram (optional)
   * 4 = explanation-1
   * 4.5 = check-1 (immediately after explanation-1)
   * 5 = explanation-2 (if exists)
   * 5.5 = check-2 (immediately after explanation-2)
   * 6 = worked-example (optional)
   * 7 = guided-practice (optional)
   * 8 = practice
   * 9.5 = integrative (NOT 9 or 11)
   * 10 = spaced-review (MUST be last)
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

    // Build blocks array using CONTRACT-BASED ordering (NOT sequential)
    const blocks: any[] = [];

    // 1. Outcomes block (order: 1)
    blocks.push({
      id: `${lessonId}-outcomes`,
      type: 'outcomes',
      order: 1,
      content: {
        outcomes: plan.learningOutcomes.map((outcome, idx) => ({
          text: outcome,
          bloomLevel: this.inferBloomLevel(outcome, idx),
        })),
      },
    });

    // 2. Vocab block (order: 2)
    blocks.push({
      id: `${lessonId}-vocab`,
      type: 'vocab',
      order: 2,
      content: {
        terms: vocabulary.terms,
      },
    });

    // 3. Diagram block (order: 3) - optional
    if (plan.needsDiagram) {
      // Use diagram elements from Phase 3 if available
      const diagramElements = explanations.diagramElements;
      
      blocks.push({
        id: `${lessonId}-diagram`,
        type: 'diagram',
        order: 3,
        content: {
          title: `${topic} Diagram`,
          description: `Visual representation of ${topic}`,
          videoUrl: youtubeUrl || '',
          imageUrl: imageUrl || undefined,
          diagramType: this.inferDiagramType(topic),
          elementIds: diagramElements?.elementIds.map(id => this.normalizeElementId(id)) || [],
          placeholderText: diagramElements?.placeholderDescription || `Diagram showing ${topic}`,
        },
      });
    }

    // 4 & 4.5: Explanation-1 and Check-1 (MUST be paired)
    if (explanations.explanations.length > 0 && checks.checks.length > 0) {
      blocks.push({
        id: explanations.explanations[0].id,
        type: 'explanation',
        order: 4,
        content: {
          title: explanations.explanations[0].title,
          content: explanations.explanations[0].content,
        },
      });

      blocks.push({
        id: checks.checks[0].id,
        type: 'practice',
        order: 4.5,
        content: {
          title: checks.checks[0].title,
          mode: checks.checks[0].mode,
          sequential: checks.checks[0].sequential,
          questions: checks.checks[0].questions,
        },
      });
    }

    // 5 & 5.5: Explanation-2 and Check-2 (if exists)
    if (explanations.explanations.length > 1 && checks.checks.length > 1) {
      blocks.push({
        id: explanations.explanations[1].id,
        type: 'explanation',
        order: 5,
        content: {
          title: explanations.explanations[1].title,
          content: explanations.explanations[1].content,
        },
      });

      blocks.push({
        id: checks.checks[1].id,
        type: 'practice',
        order: 5.5,
        content: {
          title: checks.checks[1].title,
          mode: checks.checks[1].mode,
          sequential: checks.checks[1].sequential,
          questions: checks.checks[1].questions,
        },
      });
    }

    // 6. Worked example block (order: 6) - optional
    if (workedExample.workedExample) {
      blocks.push({
        id: workedExample.workedExample.id,
        type: 'worked-example',
        order: 6,
        content: {
          title: workedExample.workedExample.title,
          given: workedExample.workedExample.given,
          steps: workedExample.workedExample.steps,
          notes: workedExample.workedExample.notes,
        },
      });
    }

    // 7. Guided practice block (order: 7) - optional
    if (workedExample.guidedPractice) {
      blocks.push({
        id: workedExample.guidedPractice.id,
        type: 'guided-practice',
        order: 7,
        content: {
          title: workedExample.guidedPractice.title,
          problem: workedExample.guidedPractice.problem,
          steps: workedExample.guidedPractice.steps,
        },
      });
    }

    // 8. Practice block (order: 8)
    blocks.push({
      id: practice.practice.id,
      type: 'practice',
      order: 8,
      content: {
        title: practice.practice.title,
        questions: practice.practice.questions,
      },
    });

    // 9.5. Integrative block (order: 9.5) - CRITICAL: NOT 9!
    blocks.push({
      id: integration.integrative.id,
      type: 'practice',
      order: 9.5,
      content: {
        title: integration.integrative.title,
        mode: integration.integrative.mode,
        sequential: integration.integrative.sequential,
        questions: integration.integrative.questions,
      },
    });

    // 10. Spaced review block (order: 10) - MUST BE LAST
    blocks.push({
      id: spacedReview.spacedReview.id,
      type: 'spaced-review',
      order: 10,
      content: {
        title: spacedReview.spacedReview.title,
        questions: spacedReview.spacedReview.questions,
        notes: spacedReview.spacedReview.notes,
      },
    });

    // Sort blocks by order (handles optional blocks)
    blocks.sort((a, b) => a.order - b.order);

    // Validate block order uniqueness and monotonic increasing
    this.validateBlockOrders(blocks);
    
    // Validate order contract compliance
    this.validateOrderContract(blocks);

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
   * Normalize element ID to kebab-case format
   * Converts "Ring Final Circuit" or "ring_final_circuit" to "ring-final-circuit"
   */
  private normalizeElementId(id: string): string {
    return id
      .toLowerCase()
      .trim()
      .replace(/[_\s]+/g, '-')  // Replace underscores and spaces with hyphens
      .replace(/[^a-z0-9-]/g, '')  // Remove any non-alphanumeric characters except hyphens
      .replace(/-+/g, '-')  // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
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

  /**
   * Validate that block orders follow the required contract
   * 
   * Contract: 1, 2, (3), 4, 4.5, (5, 5.5), (6, 7), 8, 9.5, 10
   * Where () indicates optional blocks
   */
  private validateOrderContract(blocks: any[]): void {
    const orders = blocks.map(b => b.order);
    
    // Required orders that MUST exist
    const required = [1, 2, 8, 9.5, 10];
    for (const order of required) {
      if (!orders.includes(order)) {
        throw new Error(
          `ORDER CONTRACT VIOLATION: Missing required block order ${order}. ` +
          `Required orders: 1 (outcomes), 2 (vocab), 8 (practice), 9.5 (integrative), 10 (spaced-review)`
        );
      }
    }
    
    // Spaced review MUST be last (order 10)
    const lastOrder = orders[orders.length - 1];
    if (lastOrder !== 10) {
      throw new Error(
        `ORDER CONTRACT VIOLATION: Spaced review must be last with order 10, ` +
        `but found order ${lastOrder} as last block.`
      );
    }
    
    // If explanation at 4 exists, check at 4.5 MUST exist
    if (orders.includes(4) && !orders.includes(4.5)) {
      throw new Error(
        `ORDER CONTRACT VIOLATION: Explanation at order 4 requires understanding check at order 4.5`
      );
    }
    
    // If explanation at 5 exists, check at 5.5 MUST exist
    if (orders.includes(5) && !orders.includes(5.5)) {
      throw new Error(
        `ORDER CONTRACT VIOLATION: Explanation at order 5 requires understanding check at order 5.5`
      );
    }
    
    // Integrative MUST be at 9.5 (not 9, not 11)
    if (!orders.includes(9.5)) {
      throw new Error(
        `ORDER CONTRACT VIOLATION: Integrative block must be at order 9.5 (found in orders: ${orders.join(', ')})`
      );
    }
    
    // Explanation at 4 MUST exist (we always have at least one explanation)
    if (!orders.includes(4)) {
      throw new Error(
        `ORDER CONTRACT VIOLATION: First explanation must be at order 4`
      );
    }
    
    // Check at 4.5 MUST exist (we always have at least one check)
    if (!orders.includes(4.5)) {
      throw new Error(
        `ORDER CONTRACT VIOLATION: First understanding check must be at order 4.5`
      );
    }
  }
}
