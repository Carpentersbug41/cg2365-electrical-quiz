import { QuestionBlueprint, SyllabusAssessmentCriteria } from '../types';

export interface BatchPromptParams {
  unit_code: string;
  lo_code: string;
  level: 2 | 3;
  count: number;
  lo_text: string;
  ac_list: Array<Pick<SyllabusAssessmentCriteria, 'ac_code' | 'ac_text' | 'range_notes'>>;
  anti_duplicate_history: string;
  context_injections?: string[];
}

export function createSingleQuestionPrompt(blueprint: QuestionBlueprint, acContext: { lo_text?: string; ac_text?: string; range_notes?: string | null }): string {
  const injections = [
    `LO text: ${acContext.lo_text ?? ''}`,
    `AC text: ${acContext.ac_text ?? ''}`,
    `Range notes: ${acContext.range_notes ?? ''}`,
  ]
    .filter((line) => line.trim().length > 0)
    .join('\n');

  return [
    'You are generating exactly ONE assessment item as strict JSON only.',
    'Return a JSON object with keys:',
    'unit_code, lo_code, ac_code, level, difficulty, format, stem, options, correct, rationale.',
    'Hard constraints:',
    '- Stay strictly in the selected LO/AC syllabus scope.',
    '- Do not drift into adjacent topics.',
    '- For mcq/multi_select/scenario include at least 4 distinct options.',
    '- For mcq: correct must be one option string.',
    '- For multi_select: correct must be an array subset of options.',
    '- Do not include markdown or code fences.',
    '',
    `Blueprint: ${JSON.stringify(blueprint)}`,
    `Syllabus context: ${JSON.stringify(acContext)}`,
    injections ? `Context injection:\n${injections}` : '',
  ]
    .filter((line) => line.length > 0)
    .join('\n');
}

export function createBatchGenerationPrompt(params: BatchPromptParams): string {
  const acSection = params.ac_list
    .map((ac) => `- ${ac.ac_code}: ${ac.ac_text}${ac.range_notes ? ` | range: ${ac.range_notes}` : ''}`)
    .join('\n');
  const injectedText = (params.context_injections ?? []).filter((line) => line.trim().length > 0);

  return [
    `Generate exactly ${params.count} distinct MCQ questions as strict JSON only.`,
    'Return object shape: {"questions":[{"unit_code","lo_code","ac_code","level","difficulty","format","stem","options","correct","rationale"}]}',
    'Output constraints:',
    '- unit_code must be exactly the provided unit_code',
    '- lo_code must be exactly the provided lo_code',
    '- ac_code must be one of the provided AC codes',
    '- format must be "mcq"',
    '- options must be exactly 4',
    '- correct must match exactly one option string',
    '- rationale must briefly justify LO/AC alignment',
    '- avoid duplicates and paraphrases',
    '- each question must assess a materially different angle/scenario',
    '- stay strictly in provided LO/AC context; reject adjacent-topic drift',
    '',
    `Scope: unit_code=${params.unit_code}, lo_code=${params.lo_code}, level=${params.level}`,
    `LO text: ${params.lo_text}`,
    'Allowed AC context:',
    acSection || '- (none)',
    '',
    injectedText.length > 0 ? `Additional injected context:\n${injectedText.join('\n')}` : '',
    'Existing approved question history (avoid duplicating/paraphrasing):',
    params.anti_duplicate_history || '(none)',
  ]
    .filter((line) => line.length > 0)
    .join('\n');
}
