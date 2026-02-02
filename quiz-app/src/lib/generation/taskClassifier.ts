/**
 * Task Type Classifier
 * Classifies lessons by task type to determine required blocks and context
 */

export type TaskType = 
  | 'calculation'
  | 'procedure'
  | 'selection'
  | 'diagnosis'
  | 'identification'
  | 'compliance';

/**
 * Classify a lesson based on topic, section, and structure
 * Returns array of task types (lessons can have multiple types)
 */
export function classifyLessonTask(
  topic: string,
  section: string,
  mustHaveTopics?: string
): TaskType[] {
  const tasks: TaskType[] = [];
  const text = `${topic} ${section} ${mustHaveTopics || ''}`.toLowerCase();
  
  // Calculation indicators
  if (text.match(/ohm|power|energy|calculation|formula|scale|diversity|voltage|current|resistance|impedance|capacitance|inductance/)) {
    tasks.push('calculation');
  }
  
  // Procedure indicators
  if (text.match(/isolation|testing sequence|emergency|step|procedure|install|sequence|process|method|safe working/)) {
    tasks.push('procedure');
  }
  
  // Selection indicators
  if (text.match(/choose|select|cable|ppe|containment|device|suitable|appropriate|criteria|decision|type/)) {
    tasks.push('selection');
  }
  
  // Diagnosis indicators
  if (text.match(/fault|symptoms|diagnose|troubleshoot|problem|defect|inspection|testing|verify/)) {
    tasks.push('diagnosis');
  }
  
  // Identification indicators
  if (text.match(/symbol|identify|recognize|component|marking|drawing|source|diagram|schematic|plan/)) {
    tasks.push('identification');
  }
  
  // Compliance indicators
  if (text.match(/regulation|bs 7671|legal|requirement|documentation|certificate|standard|code|compliance|legislation/)) {
    tasks.push('compliance');
  }
  
  return tasks;
}

/**
 * Determine if a lesson requires a worked example based on task types
 */
export function requiresWorkedExample(tasks: TaskType[]): boolean {
  // Calculation, procedure, and selection tasks benefit from worked examples
  return tasks.some(t => ['calculation', 'procedure', 'selection'].includes(t));
}

/**
 * Get task-specific context guidance for prompt generation
 */
export function getTaskContext(tasks: TaskType[], topic: string, section: string): string {
  if (tasks.length === 0) {
    return `This lesson covers ${topic} in the context of ${section}. Provide clear explanations suitable for Level 2 electrical installation students with practical applications.`;
  }
  
  const contexts: string[] = [];
  
  if (tasks.includes('calculation')) {
    contexts.push('This involves calculations. Include worked examples with clear step-by-step solutions. Show formula rearrangements. Emphasize practical problem-solving. Use realistic values.');
  }
  
  if (tasks.includes('procedure')) {
    contexts.push('This is a procedural lesson. Include step-by-step sequences. Use numbered lists for procedures. Emphasize safety and correct order. Include a worked example showing the complete procedure.');
  }
  
  if (tasks.includes('selection')) {
    contexts.push('This involves selection decisions. Include decision criteria, comparison factors, and practical considerations. Show a worked example of the decision-making process with clear reasoning.');
  }
  
  if (tasks.includes('diagnosis')) {
    contexts.push('This covers fault finding and diagnosis. Include symptom-to-cause relationships, systematic approach, and practical testing methods. Focus on logical troubleshooting.');
  }
  
  if (tasks.includes('identification')) {
    contexts.push('This focuses on identification and recognition. Include clear descriptions, distinguishing features, and visual/symbolic characteristics. Use diagrams where helpful.');
  }
  
  if (tasks.includes('compliance')) {
    contexts.push('This covers regulations and compliance. Focus on specific requirements, legal obligations, and documentation. Use exact regulation references where applicable. Emphasize responsibilities.');
  }
  
  return contexts.join(' ');
}

/**
 * Determine appropriate diagram type based on task types and topic
 */
export function inferDiagramType(tasks: TaskType[], topic: string): string {
  const topicLower = topic.toLowerCase();
  
  // Circuit-related
  if (topicLower.includes('series')) return 'series';
  if (topicLower.includes('parallel')) return 'parallel';
  if (topicLower.includes('circuit')) return 'circuit';
  
  // Installation-related
  if (topicLower.includes('plan') || topicLower.includes('layout')) return 'plan';
  if (topicLower.includes('wiring')) return 'wiring';
  if (topicLower.includes('schematic') || topicLower.includes('drawing')) return 'schematic';
  
  // Process-related
  if (tasks.includes('procedure')) return 'procedure';
  
  // Other
  if (topicLower.includes('table') || topicLower.includes('data')) return 'table';
  if (topicLower.includes('graph') || topicLower.includes('waveform')) return 'graph';
  if (topicLower.includes('block')) return 'block';
  
  return 'other';
}
