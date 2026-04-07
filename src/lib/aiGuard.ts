/**
 * DreamSync AI Guard - Global Safety Layer
 * Ensures all career inputs are professional, legal, and safe.
 */

interface GuardResult {
  allowed: boolean;
  message: string;
}

const BLOCKED_KEYWORDS = [
  'terrorist', 'terrorism', 'terroist', 'terror',
  'bomb', 'explosive', 'weapon', 'gun', 'kill',
  'attack', 'violence', 'murder', 'blood',
  'fraud', 'scam', 'scheme', 'money laundering',
  'illegal', 'hacking', 'cracker', 'cyber attack',
  'cybercrime', 'phishing', 'virus', 'malware',
  'drugs', 'narcotics', 'cannabis', 'marijuana', 'meth',
  'sex', 'porn', 'nsfw', 'adult',
  'suicide', 'death', 'torture', 'kidnap'
];

const SAFE_EXEMPTIONS = [
  'ethical hacker', 
  'cybersecurity analyst', 
  'security engineer', 
  'penetration tester',
  'forensic accountant',
  'compliance officer'
];

export function validateCareerInput(input: string): GuardResult {
  if (!input) {
    return { allowed: true, message: '' };
  }

  const normalized = input.toLowerCase().trim();

  // 1. Check for safe exemptions first
  for (const exemption of SAFE_EXEMPTIONS) {
    if (normalized.includes(exemption)) {
      return { allowed: true, message: '' };
    }
  }

  // 2. Check for blocked keywords
  for (const keyword of BLOCKED_KEYWORDS) {
    // Exact or partial match
    if (normalized.includes(keyword)) {
      // Basic fuzzy check for common typos/variations (leaked via normalization)
      return {
        allowed: false,
        message: "⚠️ DreamSync only supports safe, legal, and professional career paths. Please choose a valid role like Software Engineer, Data Analyst, Designer, etc."
      };
    }
  }

  // 3. Length check
  if (normalized.length > 100) {
    return {
      allowed: false,
      message: "⚠️ Input is abnormally long. Please enter a concise professional role name."
    };
  }

  return { allowed: true, message: '' };
}

/**
 * Logs a blocked safety violation to Firestore or console
 */
export async function logSafetyViolation(userId: string | undefined, input: string) {
  try {
    const logData = {
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      blockedInput: input,
      severity: 'HIGH'
    };
    
    console.warn('[AI GUARD VIOLATION]:', JSON.stringify(logData));
    
    // Potential Firestore logging logic here:
    // import { db } from './firebase';
    // import { collection, addDoc } from 'firebase/firestore';
    // await addDoc(collection(db, 'safety_logs'), logData);
  } catch (error) {
    console.error('Failed to log safety violation:', error);
  }
}
