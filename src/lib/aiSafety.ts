/**
 * DreamSync AI Safety System
 * - Global input validation to block harmful, illegal, or unethical roles.
 * - Normalized check for typos and leetspeak (e.g., terr0rist).
 */

export interface ValidationResult {
  allowed: boolean;
  message: string;
}

const BLOCKED_KEYWORDS = [
  'terrorist', 'terrorism', 'bomb', 'weapon', 'hacking', 'cyberattack', 
  'drug manufacturing', 'fraud', 'scam', 'violence', 'murder', 'killer',
  'assassin', 'theft', 'robbery', 'extremist', 'radicalization',
  'anti-national', 'sedition', 'insurrection'
];

const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
  '!': 'i'
};

/**
 * Normalizes input by removing special characters and de-leetifying.
 */
function normalizeInput(input: string): string {
  let normalized = input.toLowerCase();
  
  // Replace leetspeak characters
  for (const [key, value] of Object.entries(LEET_MAP)) {
    normalized = normalized.split(key).join(value);
  }
  
  // Remove special characters except spaces
  return normalized.replace(/[^a-z0-9 ]/g, '');
}

/**
 * Validates user input for AI interactions.
 */
export function validateUserInput(input: string): ValidationResult {
  const normalizedInput = normalizeInput(input);
  
  const isHarmful = BLOCKED_KEYWORDS.some(keyword => {
    // Check for exact match or word-boundary match to avoid blocking "ethical hacker" incorrectly
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    
    // Special exception: "ethical hacking" is allowed
    if (keyword === 'hacking' && normalizedInput.includes('ethical hacking')) {
      return false;
    }
    
    return regex.test(normalizedInput);
  });

  if (isHarmful) {
    return {
      allowed: false,
      message: "This platform does not support harmful or illegal career paths. Please choose a valid professional role."
    };
  }

  return { allowed: true, message: "" };
}

/**
 * Log blocked attempts (placeholder for now, can be extended to Firebase)
 */
export function logBlockedAttempt(keyword: string, userId?: string) {
  console.warn(`[AI SAFETY] Blocked attempt: "${keyword}" | User: ${userId || 'Anonymous'} | Time: ${new Date().toISOString()}`);
}

/**
 * Standard AI Safety Prompt Fragment
 */
export const AI_SAFETY_INSTRUCTION = "You must refuse to generate content related to illegal, harmful, unethical, or dangerous activities. Only provide safe, legal, and professional career guidance.";
