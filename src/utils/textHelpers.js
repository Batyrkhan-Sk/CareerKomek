/**
 * Extracts meaningful keywords from answer text by removing common phrases
 * @param {string} text - The answer text to process
 * @returns {string[]} - Array of extracted keywords
 */
export function extractKeywords(text) {
  const commonPhrases = [
    'I prefer', 'I like', 'I enjoy', 'I want', 'I would',
    'focusing on', 'working with', 'letting someone else',
    'built-in', 'from scratch', 'handle the', 'someone else'
  ];

  let cleaned = text;
  commonPhrases.forEach(phrase => {
    cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
  });

  const keywords = cleaned
    .split(/[,.;]|and(?!\w)|or(?!\w)/)
    .map(s => s.trim())
    .filter(s => s.length > 3)
    .filter(s => !['both', 'else', 'with', 'that', 'this'].includes(s.toLowerCase()));

  return keywords;
}