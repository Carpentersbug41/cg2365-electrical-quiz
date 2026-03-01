export type EvaluatePayload = {
  feedback: string;
  isCorrect: boolean;
  score?: 0 | 1 | 2;
  misconceptionCode?: string | null;
  evidenceQuote?: string;
  nextAction?: 'retry' | 'advance' | 'repair';
};

export type NextQuestionPayload = {
  question: string;
  intent?: 'diagnose' | 'repair' | 'verify' | 'transfer';
};

export type SocraticParseMode = 'question' | 'evaluation';

export function stripWrappingQuotes(value: string): string {
  let output = value.trim();
  if (output.startsWith('"')) output = output.slice(1);
  if (output.endsWith('"')) output = output.slice(0, -1);
  return output
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .trim();
}

export function salvageSocraticPayload(raw: string, mode: SocraticParseMode): NextQuestionPayload | EvaluatePayload {
  const text = raw.trim();

  if (mode === 'question') {
    const quoted = text.match(/"question"\s*:\s*"([\s\S]*?)"\s*(?:,|})/i);
    const intentMatch = text.match(/"intent"\s*:\s*"([\w-]+)"/i);
    const intent = intentMatch?.[1]?.toLowerCase();
    const normalizedIntent =
      intent === 'diagnose' || intent === 'repair' || intent === 'verify' || intent === 'transfer'
        ? intent
        : undefined;
    if (quoted?.[1]) {
      return { question: stripWrappingQuotes(quoted[1]), intent: normalizedIntent };
    }

    const loose = text.match(/question\s*[:\-]\s*([\s\S]+)/i);
    if (loose?.[1]) {
      return {
        question: stripWrappingQuotes(loose[1]).replace(/[}\]]+$/, '').trim(),
        intent: normalizedIntent,
      };
    }

    return { question: stripWrappingQuotes(text.replace(/[{}\[\]]/g, '')), intent: normalizedIntent };
  }

  const feedbackQuoted = text.match(/"feedback"\s*:\s*"([\s\S]*?)"\s*(?:,|})/i);
  const feedbackLoose = text.match(/feedback\s*[:\-]\s*([\s\S]+)/i);
  const correctness = /"isCorrect"\s*:\s*true|\bisCorrect\b\s*[:\-]?\s*true|\bcorrect\b/i.test(text);
  const scoreMatch = text.match(/"score"\s*:\s*([0-2])|score\s*[:\-]\s*([0-2])/i);
  const parsedScore = Number(scoreMatch?.[1] ?? scoreMatch?.[2]);
  const score = parsedScore === 0 || parsedScore === 1 || parsedScore === 2 ? (parsedScore as 0 | 1 | 2) : undefined;
  const misconceptionMatch = text.match(/"misconceptionCode"\s*:\s*"([\w-]+)"|misconceptionCode\s*[:\-]\s*([\w-]+)/i);
  const misconceptionCode = misconceptionMatch?.[1] ?? misconceptionMatch?.[2] ?? null;
  const evidenceMatch = text.match(/"evidenceQuote"\s*:\s*"([\s\S]*?)"\s*(?:,|})/i);
  const feedback = feedbackQuoted?.[1]
    ? stripWrappingQuotes(feedbackQuoted[1])
    : feedbackLoose?.[1]
      ? stripWrappingQuotes(feedbackLoose[1]).replace(/[}\]]+$/, '').trim()
      : stripWrappingQuotes(text.replace(/[{}\[\]]/g, ''));

  return {
    feedback: feedback || 'Thanks. Let us continue.',
    isCorrect: score !== undefined ? score >= 2 : correctness,
    score,
    misconceptionCode,
    evidenceQuote: evidenceMatch?.[1] ? stripWrappingQuotes(evidenceMatch[1]) : '',
    nextAction: score !== undefined ? (score >= 2 ? 'advance' : misconceptionCode ? 'repair' : 'retry') : undefined,
  };
}

export function deterministicFallbackQuestion(
  lessonSummary: string,
  level: number,
  intent: 'diagnose' | 'repair' | 'verify' | 'transfer' = 'diagnose'
): string {
  const outcomeLine = lessonSummary
    .split('\n')
    .find((line) => /^\d+\.\s+/.test(line))
    ?.replace(/^\d+\.\s+/, '')
    .trim();

  const topic = outcomeLine || 'the main idea from this lesson';

  if (intent === 'repair') {
    return `What is the key idea that corrects your earlier mistake about ${topic}?`;
  }
  if (intent === 'verify') {
    return `Check your understanding: can you explain ${topic} clearly in one concise answer?`;
  }
  if (intent === 'transfer') {
    return `In a new scenario, how would you apply ${topic}, and why?`;
  }
  if (level <= 1) {
    return `In your own words, what is ${topic}?`;
  }
  if (level === 2) {
    return `How does ${topic} connect to another idea in this lesson?`;
  }
  if (level === 3) {
    return `Can you combine two ideas from this lesson to explain ${topic}?`;
  }
  return `What do you predict would happen if ${topic} changed, and why?`;
}

export function deterministicFallbackEvaluation(answer: string): EvaluatePayload {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const isCorrect = words >= 8;
  if (isCorrect) {
    return {
      feedback: 'Good response. You explained a key idea clearly; now try to connect it to a second concept.',
      isCorrect: true,
      score: 2,
      misconceptionCode: null,
      evidenceQuote: '',
      nextAction: 'advance',
    };
  }
  return {
    feedback: 'You have started well. Add one specific detail and explain why it matters.',
    isCorrect: false,
    score: words >= 4 ? 1 : 0,
    misconceptionCode: null,
    evidenceQuote: '',
    nextAction: 'retry',
  };
}
