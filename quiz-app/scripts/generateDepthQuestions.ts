/**
 * Generate Progressive Depth-of-Processing Questions
 * Uses Gemini AI to generate L2-L3-L4 questions for lesson explanation blocks
 */

import fs from 'fs';
import path from 'path';
import { getGeminiModelWithDefault } from '../src/lib/config/geminiConfig';
import { createLLMClientWithFallback } from '../src/lib/llm/client';

// Load environment variables from .env.local manually
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = envContent.split('\n');
    
    for (const line of envVars) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    }
    console.log('✅ Loaded environment from .env.local\n');
  } else {
    console.log('⚠️  No .env.local found, using process environment\n');
  }
}

loadEnvFile();

// Initialize LLM client using abstraction layer
let llmClient: Awaited<ReturnType<typeof createLLMClientWithFallback>> | null = null;

function getModelName(): string {
  try {
    return getGeminiModelWithDefault();
  } catch (error) {
    console.error('❌ GEMINI_MODEL is not set in environment variables');
    console.error('Please set GEMINI_MODEL in .env.local');
    process.exit(1);
  }
}

async function initializeClient() {
  if (!llmClient) {
    try {
      llmClient = await createLLMClientWithFallback();
      const modelName = getModelName();
      console.log(`Using model: ${modelName}\n`);
    } catch (error) {
      console.error('❌ Failed to initialize LLM client');
      console.error('Please check your configuration (GEMINI_API_KEY or Vertex AI setup)');
      process.exit(1);
    }
  }
  return llmClient;
}

interface GeneratedQuestion {
  id: string;
  questionText: string;
  answerType: 'short-text';
  cognitiveLevel: 'connection' | 'synthesis' | 'hypothesis';
  expectedKeywords: string[];
  minimumKeywordMatch: number;
  expectedAnswer: string[];
  hint: string;
}

interface QuestionSet {
  questions: GeneratedQuestion[];
}

interface ExplanationBlock {
  id: string;
  type: string;
  order: number;
  content: {
    title: string;
    content: string;
    subsections?: Array<{
      title: string;
      content: string;
    }>;
  };
}

interface Lesson {
  id: string;
  title: string;
  blocks: Array<{
    id: string;
    type: string;
    order: number;
    content: unknown;
  }>;
}

const PROMPT_TEMPLATE = `You are an expert educational content creator for C&G 2365 Level 2 Electrical Science.

LESSON SECTION:
Title: {TITLE}
Content: {CONTENT}

TASK:
Generate 3 progressive depth-of-processing questions for this section.

REQUIREMENTS:
- Question 1 (Level 2 - Connection): Link two concepts from the explanation. Ask "how" or "what is the relationship" between concepts.
- Question 2 (Level 3 - Synthesis): Combine multiple ideas into reasoning. Ask "why" questions that require combining concepts.
- Question 3 (Level 4 - Hypothesis): Predict or justify something beyond the text. Ask "what if" or "what would happen" questions.

CONSTRAINTS:
- Questions must be answerable using ONLY the content provided above
- Stay within C&G 2365 Level 2 scope (no advanced calculus, complex theory)
- Keywords must reflect realistic student language (not textbook jargon)
- Avoid trick questions or irrelevant hypotheticals
- Each question should require a 2-4 sentence answer
- Keywords should be individual words or short phrases (2-3 words max)

OUTPUT FORMAT:
Return ONLY valid JSON (no markdown, no code blocks) in this exact structure:
{
  "questions": [
    {
      "questionText": "...",
      "cognitiveLevel": "connection",
      "expectedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
      "minimumKeywordMatch": 3,
      "expectedAnswer": ["A sample answer showing the expected concepts"],
      "hint": "..."
    },
    {
      "questionText": "...",
      "cognitiveLevel": "synthesis",
      "expectedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
      "minimumKeywordMatch": 3,
      "expectedAnswer": ["A sample answer showing the expected concepts"],
      "hint": "..."
    },
    {
      "questionText": "...",
      "cognitiveLevel": "hypothesis",
      "expectedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
      "minimumKeywordMatch": 3,
      "expectedAnswer": ["A sample answer showing the expected concepts"],
      "hint": "..."
    }
  ]
}

EXAMPLE (for reference only):
For a section on "AC vs DC":
Level 2: "How does the direction of current flow differ between AC and DC?"
Level 3: "Why is it easier to change voltage levels with AC than with DC? Explain the connection."
Level 4: "If the UK switched to DC mains supply, what problems would occur in the electrical grid? Justify your answer."

Remember: Return ONLY the JSON object, nothing else.`;

async function generateQuestions(
  lessonId: string,
  sectionNumber: number,
  title: string,
  content: string
): Promise<QuestionSet> {
  // #region agent log
  console.log('🔍 [DEBUG] generateQuestions entry', {lessonId,sectionNumber,titleLength:title.length,contentLength:content.length});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:149',message:'generateQuestions entry',data:{lessonId,sectionNumber,title,contentLength:content.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
  const prompt = PROMPT_TEMPLATE
    .replace('{TITLE}', title)
    .replace('{CONTENT}', content);

  // #region agent log
  console.log('🔍 [DEBUG] Prompt built', {promptLength:prompt.length,hasTitle:prompt.includes(title),hasContent:prompt.includes(content.substring(0,50))});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:156',message:'Prompt built',data:{promptLength:prompt.length,titleLength:title.length,contentLength:content.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  console.log(`  🤖 Generating questions for: ${title}`);

  try {
    const client = await initializeClient();
    const modelName = getModelName();
    const model = client.getGenerativeModel({ model: modelName });
    
    // #region agent log
    console.log('🔍 [DEBUG] About to call LLM API', {modelName});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:162',message:'About to call LLM API',data:{modelName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // #region agent log
    console.log('🔍 [DEBUG] LLM API response received', {responseLength:responseText.length,responsePreview:responseText.substring(0,200),startsWithJson:responseText.trim().startsWith('{'),startsWithMarkdown:responseText.trim().startsWith('```')});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:167',message:'LLM API response received',data:{responseLength:responseText.length,responsePreview:responseText.substring(0,200),startsWithJson:responseText.trim().startsWith('{'),startsWithMarkdown:responseText.trim().startsWith('```')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // Try to extract JSON from the response (in case it's wrapped in markdown)
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // #region agent log
    console.log('🔍 [DEBUG] JSON text extracted', {jsonTextLength:jsonText.length,jsonPreview:jsonText.substring(0,200)});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:175',message:'JSON text extracted',data:{jsonTextLength:jsonText.length,jsonPreview:jsonText.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    const parsed: QuestionSet = JSON.parse(jsonText);
    
    // #region agent log
    console.log('🔍 [DEBUG] JSON parsed successfully', {questionsCount:parsed.questions?.length,firstQuestionId:parsed.questions?.[0]?.id});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:180',message:'JSON parsed successfully',data:{questionsCount:parsed.questions?.length,firstQuestionId:parsed.questions?.[0]?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // Add IDs to questions
    parsed.questions = parsed.questions.map((q, index) => ({
      ...q,
      id: `${lessonId}-C${sectionNumber}-L${index === 0 ? '2' : index === 1 ? '3' : '4'}`,
      answerType: 'short-text' as const,
    }));
    
    console.log(`  ✅ Generated ${parsed.questions.length} questions`);
    return parsed;
  } catch (error) {
    // #region agent log
    console.error('🔍 [DEBUG] Error in generateQuestions', {errorMessage:error instanceof Error?error.message:String(error),errorType:error?.constructor?.name,errorStack:error instanceof Error?error.stack?.substring(0,200):''});
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:189',message:'Error in generateQuestions',data:{errorMessage:error instanceof Error?error.message:String(error),errorType:error?.constructor?.name,errorString:JSON.stringify(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    console.error(`  ❌ Error generating questions:`, error);
    throw error;
  }
}

async function processLesson(lessonPath: string): Promise<void> {
  // #region agent log
  console.log('🔍 [DEBUG] processLesson entry', {lessonPath});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:192',message:'processLesson entry',data:{lessonPath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  
  const lessonData: Lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));
  const lessonId = lessonData.id;
  
  // #region agent log
  console.log('🔍 [DEBUG] Lesson loaded', {lessonId,title:lessonData.title,blocksCount:lessonData.blocks.length});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:197',message:'Lesson loaded',data:{lessonId,title:lessonData.title,blocksCount:lessonData.blocks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  
  console.log(`\n📚 Processing lesson: ${lessonData.title} (${lessonId})`);
  
  // Find all explanation blocks
  const explanationBlocks = lessonData.blocks.filter(
    block => block.type === 'explanation'
  ) as ExplanationBlock[];
  
  // #region agent log
  console.log('🔍 [DEBUG] Explanation blocks found', {explanationBlocksCount:explanationBlocks.length});
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:206',message:'Explanation blocks found',data:{explanationBlocksCount:explanationBlocks.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
  
  if (explanationBlocks.length === 0) {
    console.log(`  ⚠️  No explanation blocks found, skipping`);
    return;
  }
  
  console.log(`  📖 Found ${explanationBlocks.length} explanation block(s)`);
  
  const newBlocks: Lesson['blocks'] = [];
  let sectionNumber = 1;
  
  for (const block of explanationBlocks) {
    const title = block.content.title;
    let content = block.content.content;
    
    // Include subsections if present
    if (block.content.subsections) {
      content += '\n\n' + block.content.subsections
        .map(sub => `${sub.title}\n${sub.content}`)
        .join('\n\n');
    }
    
    try {
      const questionSet = await generateQuestions(lessonId, sectionNumber, title, content);
      
      // Create new practice block
      const checkBlock = {
        id: `${lessonId}-check-${sectionNumber}`,
        type: 'practice',
        order: block.order + 0.5,
        content: {
          title: `Check Your Understanding: ${title}`,
          mode: 'conceptual',
          sequential: true,
          questions: questionSet.questions,
        },
      };
      
      newBlocks.push(checkBlock);
      sectionNumber++;
      
      // Rate limit: wait 2 seconds between API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      // #region agent log
      console.error('🔍 [DEBUG] Error in processLesson loop', {errorMessage:error instanceof Error?error.message:String(error),title,sectionNumber});
      fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'generateDepthQuestions.ts:245',message:'Error in processLesson loop',data:{errorMessage:error instanceof Error?error.message:String(error),title,sectionNumber},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      console.error(`  ❌ Failed to generate questions for "${title}":`, error);
    }
  }
  
  if (newBlocks.length > 0) {
    // Insert new blocks into lesson
    lessonData.blocks.push(...newBlocks);
    
    // Sort blocks by order
    lessonData.blocks.sort((a, b) => a.order - b.order);
    
    // Write back to file
    fs.writeFileSync(lessonPath, JSON.stringify(lessonData, null, 2));
    console.log(`  💾 Saved ${newBlocks.length} understanding check block(s)`);
  }
}

async function main() {
  const lessonsDir = path.join(__dirname, '../src/data/lessons');
  
  // Get all lesson JSON files
  const lessonFiles = fs.readdirSync(lessonsDir)
    .filter(file => file.endsWith('.json') && !file.includes('index'))
    .sort();
  
  console.log(`🚀 Starting question generation for ${lessonFiles.length} lessons\n`);
  console.log('Lessons to process:');
  lessonFiles.forEach((file, i) => console.log(`  ${i + 1}. ${file}`));
  
  for (const file of lessonFiles) {
    const lessonPath = path.join(lessonsDir, file);
    try {
      await processLesson(lessonPath);
    } catch (error) {
      console.error(`\n❌ Failed to process ${file}:`, error);
      console.log('Continuing with next lesson...\n');
    }
  }
  
  console.log('\n✨ Question generation complete!');
  console.log('\n📋 Next steps:');
  console.log('  1. Review generated questions in each lesson JSON file');
  console.log('  2. Test questions in the UI for quality and clarity');
  console.log('  3. Adjust keywords or minimumKeywordMatch if needed');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
