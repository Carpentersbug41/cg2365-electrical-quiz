/**
 * HTML Entity Utilities
 * Provides functions to decode HTML entities in strings
 */

/**
 * Decode HTML entities in a string
 * Used for converting stored HTML entities to display text
 * 
 * @param text - The text containing HTML entities
 * @returns The decoded text with entities converted to characters
 * 
 * @example
 * decodeHtmlEntities("What it is &amp; how to &quot;read&quot; it")
 * // Returns: 'What it is & how to "read" it'
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof text !== 'string') return text;
  
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
