/**
 * Readability Score Calculator
 * Adapted Flesch-Kincaid for Slovak language
 * 
 * Slovak has longer words on average, so we adjust the formula slightly.
 */

interface ReadabilityResult {
  score: number;
  grade: string;
  description: string;
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
}

/**
 * Count syllables in a Slovak word (approximation)
 * Slovak syllables are primarily based on vowels
 */
function countSyllables(word: string): number {
  const vowels = /[aáäeéiíoóôuúyý]/gi;
  const matches = word.match(vowels);
  return matches ? matches.length : 1;
}

/**
 * Count sentences in text
 */
function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return Math.max(sentences.length, 1);
}

/**
 * Get words from text
 */
function getWords(text: string): string[] {
  return text.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Calculate readability score
 * Higher score = easier to read
 * 
 * Flesch Reading Ease adapted for Slovak:
 * Score = 206.835 - (1.015 × ASL) - (60 × ASW)
 * where ASL = average sentence length, ASW = average syllables per word
 * 
 * Slovak adjustment: We reduce the syllable penalty slightly since Slovak 
 * naturally has more syllables per word than English.
 */
export function calculateReadability(text: string): ReadabilityResult {
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const words = getWords(cleanText);
  const wordCount = words.length;
  const sentenceCount = countSentences(cleanText);
  
  if (wordCount === 0) {
    return {
      score: 0,
      grade: 'N/A',
      description: 'Nedostatok textu na analýzu',
      wordCount: 0,
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
    };
  }
  
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;
  
  // Flesch Reading Ease with Slovak adjustment (reduced syllable penalty)
  let score = 206.835 - (1.015 * avgWordsPerSentence) - (50 * avgSyllablesPerWord);
  
  // Clamp score to 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  // Grade mapping
  let grade: string;
  let description: string;
  
  if (score >= 90) {
    grade = 'A+';
    description = 'Veľmi ľahko čitateľný - vhodný pre všetkých';
  } else if (score >= 80) {
    grade = 'A';
    description = 'Ľahko čitateľný - základná úroveň';
  } else if (score >= 70) {
    grade = 'B+';
    description = 'Pomerne ľahký - stredoškolská úroveň';
  } else if (score >= 60) {
    grade = 'B';
    description = 'Štandardný - bežný čitateľ zvládne';
  } else if (score >= 50) {
    grade = 'C+';
    description = 'Náročnejší - vyžaduje koncentráciu';
  } else if (score >= 30) {
    grade = 'C';
    description = 'Ťažký - akademická úroveň';
  } else {
    grade = 'D';
    description = 'Veľmi ťažký - odborná literatúra';
  }
  
  return {
    score,
    grade,
    description,
    wordCount,
    sentenceCount,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
  };
}

/**
 * Calculate estimated reading time in minutes
 * Slovak average reading speed: ~180-200 words per minute
 */
export function calculateReadingTime(text: string): number {
  const words = getWords(text.replace(/<[^>]*>/g, ''));
  const wordsPerMinute = 180;
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}


