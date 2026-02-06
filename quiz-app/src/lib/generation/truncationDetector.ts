/**
 * Truncation Detection Service
 * Multi-layered detection to catch incomplete LLM responses before parsing
 */

export interface TruncationCheckResult {
  isTruncated: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  metadata?: {
    finishReason?: string;
    candidatesTokenCount?: number;
    maxOutputTokens?: number;
    tokenUtilization?: number;
  };
}

export interface UsageMetadata {
  candidatesTokenCount?: number;
  promptTokenCount?: number;
  totalTokenCount?: number;
}

/**
 * Check if response was truncated using multiple detection methods
 */
export function detectTruncation(
  response: string,
  finishReason?: string,
  usageMetadata?: UsageMetadata,
  maxOutputTokens?: number,
  type?: 'lesson' | 'quiz' | 'phase' | 'score'
): TruncationCheckResult {
  const reasons: string[] = [];
  let confidence: 'high' | 'medium' | 'low' = 'low';

  // Layer 1: Check finishReason (primary but unreliable signal)
  if (finishReason === 'MAX_TOKENS') {
    reasons.push('API reported MAX_TOKENS finish reason');
    confidence = 'high';
  }

  // Layer 2: Structural validation
  const structuralIssues = checkStructuralIntegrity(response);
  if (structuralIssues.length > 0) {
    reasons.push(...structuralIssues);
    confidence = confidence === 'high' ? 'high' : 'medium';
  }

  // Layer 3: API metadata check
  if (usageMetadata?.candidatesTokenCount && maxOutputTokens) {
    const tokenUtilization = usageMetadata.candidatesTokenCount / maxOutputTokens;
    if (tokenUtilization >= 0.95) {
      reasons.push(`Token utilization at ${(tokenUtilization * 100).toFixed(1)}% (near limit)`);
      confidence = 'high';
    } else if (tokenUtilization >= 0.85) {
      reasons.push(`Token utilization at ${(tokenUtilization * 100).toFixed(1)}% (approaching limit)`);
      confidence = confidence === 'low' ? 'medium' : confidence;
    }
  }

  // Layer 4: Response pattern analysis
  const patternIssues = checkResponsePatterns(response, type);
  if (patternIssues.length > 0) {
    reasons.push(...patternIssues);
    confidence = confidence === 'low' ? 'medium' : confidence;
  }

  const isTruncated = reasons.length > 0;

  return {
    isTruncated,
    confidence,
    reasons,
    metadata: {
      finishReason,
      candidatesTokenCount: usageMetadata?.candidatesTokenCount,
      maxOutputTokens,
      tokenUtilization: usageMetadata?.candidatesTokenCount && maxOutputTokens
        ? usageMetadata.candidatesTokenCount / maxOutputTokens
        : undefined,
    },
  };
}

/**
 * Check structural integrity of JSON response
 */
function checkStructuralIntegrity(response: string): string[] {
  const issues: string[] = [];
  const trimmed = response.trim();

  // Check for balanced braces and brackets
  const braceBalance = countBraces(trimmed);
  if (braceBalance.opening !== braceBalance.closing) {
    issues.push(
      `Unbalanced braces: ${braceBalance.opening} opening, ${braceBalance.closing} closing`
    );
  }

  const bracketBalance = countBrackets(trimmed);
  if (bracketBalance.opening !== bracketBalance.closing) {
    issues.push(
      `Unbalanced brackets: ${bracketBalance.opening} opening, ${bracketBalance.closing} closing`
    );
  }

  // Check for unterminated strings
  if (hasUnterminatedString(trimmed)) {
    issues.push('Detected unterminated string literal');
  }

  // Check if response ends properly (should end with } or ])
  if (!trimmed.endsWith('}') && !trimmed.endsWith(']')) {
    issues.push(`Response ends with unexpected character: '${trimmed.slice(-1)}'`);
  }

  // Check for mid-word cutoff
  const last50 = trimmed.slice(-50);
  if (/[a-zA-Z]{10,}$/.test(last50)) {
    issues.push('Response appears to end mid-word');
  }

  return issues;
}

/**
 * Count opening and closing braces, ignoring those in strings
 */
function countBraces(text: string): { opening: number; closing: number } {
  let opening = 0;
  let closing = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') opening++;
      if (char === '}') closing++;
    }
  }

  return { opening, closing };
}

/**
 * Count opening and closing brackets, ignoring those in strings
 */
function countBrackets(text: string): { opening: number; closing: number } {
  let opening = 0;
  let closing = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '[') opening++;
      if (char === ']') closing++;
    }
  }

  return { opening, closing };
}

/**
 * Check for unterminated string literals
 */
function hasUnterminatedString(text: string): boolean {
  let inString = false;
  let escapeNext = false;
  let lastQuoteIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      lastQuoteIndex = i;
    }
  }

  // If we're still in a string at the end, it's unterminated
  // But only if there's significant content after the last quote
  if (inString && lastQuoteIndex >= 0) {
    const remainingContent = text.slice(lastQuoteIndex + 1).trim();
    // Allow for trailing whitespace and closing brackets
    return remainingContent.length > 10 && !/^[\s}\]]*$/.test(remainingContent);
  }

  return false;
}

/**
 * Check response patterns specific to lesson generation
 */
function checkResponsePatterns(response: string, type?: 'lesson' | 'quiz' | 'phase' | 'score'): string[] {
  const issues: string[] = [];
  const trimmed = response.trim();
  const last200 = trimmed.slice(-200);

  // For lesson JSON, should contain closing structures
  if (trimmed.startsWith('{')) {
    // Type-specific validation
    if (type === 'lesson' && !trimmed.includes('"blocks"')) {
      issues.push('Complete lesson JSON missing "blocks" property');
    } else if (type === 'score' && !trimmed.includes('"details"')) {
      issues.push('Score response missing "details" property');
    } else if (type === 'phase') {
      // Phase responses are partial structures - don't check for specific properties
      console.log(`   ℹ️  Phase response validation (no specific property checks)`);
    } else if (!type && !trimmed.includes('"blocks"')) {
      issues.push('Lesson JSON missing "blocks" property (type not specified)');
    }

    // Check if response ends abruptly without proper closure
    if (!last200.includes('}') && !last200.includes(']')) {
      issues.push('Response lacks proper closing structures in final section');
    }

    // Type-specific array checks
    if (type === 'lesson') {
      const blocksMatch = trimmed.match(/"blocks"\s*:\s*\[/);
      if (blocksMatch && !trimmed.includes(']', blocksMatch.index!)) {
        issues.push('Blocks array appears to be unclosed');
      }
    } else if (type === 'score') {
      const detailsMatch = trimmed.match(/"details"\s*:\s*\[/);
      if (detailsMatch && !trimmed.includes(']', detailsMatch.index!)) {
        issues.push('Details array appears to be unclosed');
      }
    }
  }

  // For quiz arrays, check array structure
  if (trimmed.startsWith('[')) {
    // Should have question objects
    if (!trimmed.includes('"questionText"') && !trimmed.includes('"id"')) {
      issues.push('Quiz array missing expected question properties');
    }
  }

  // Check for incomplete property values (common in truncation)
  const incompletePropertyPattern = /"\w+"\s*:\s*"[^"]{50,}$/;
  if (incompletePropertyPattern.test(last200)) {
    issues.push('Detected incomplete property value at end of response');
  }

  return issues;
}

/**
 * Determine if response should be considered too risky to parse
 */
export function isResponseSafeToParse(checkResult: TruncationCheckResult): boolean {
  // High confidence truncation = not safe
  if (checkResult.confidence === 'high') {
    return false;
  }

  // Medium confidence with multiple reasons = not safe
  if (checkResult.confidence === 'medium' && checkResult.reasons.length >= 2) {
    return false;
  }

  // Otherwise, attempt parsing
  return true;
}

/**
 * Format truncation detection results for logging
 */
export function formatTruncationReport(checkResult: TruncationCheckResult): string {
  if (!checkResult.isTruncated) {
    return 'No truncation detected';
  }

  const lines: string[] = [
    `🚨 TRUNCATION DETECTED (confidence: ${checkResult.confidence.toUpperCase()})`,
    '',
    'Reasons:',
    ...checkResult.reasons.map(r => `  - ${r}`),
  ];

  if (checkResult.metadata) {
    lines.push('');
    lines.push('Metadata:');
    if (checkResult.metadata.finishReason) {
      lines.push(`  - Finish Reason: ${checkResult.metadata.finishReason}`);
    }
    if (checkResult.metadata.candidatesTokenCount && checkResult.metadata.maxOutputTokens) {
      lines.push(
        `  - Tokens Used: ${checkResult.metadata.candidatesTokenCount} / ${checkResult.metadata.maxOutputTokens} (${(checkResult.metadata.tokenUtilization! * 100).toFixed(1)}%)`
      );
    }
  }

  return lines.join('\n');
}
