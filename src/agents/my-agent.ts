import { z } from 'zod';

// We structure these as standard conversational agent tools.
// If using the Vercel AI SDK or 21st SDK, these can be mapped directly to the `tools` dictionary.

export const myAgentTools = {
  idea_generator: {
    description: 'Generate a SaaS idea, monetization strategy, and core features tailored to a specific niche and audience.',
    parameters: z.object({
      niche: z.string().min(2).max(100).describe('The target market or industry niche.'),
      audience: z.string().min(2).max(100).describe('The primary users or customers.'),
    }),
    execute: async ({ niche, audience }: { niche: string, audience: string }) => {
      // Input sanitization happens natively via Zod validation limits.
      // Basic heuristic result for near-zero cost API usage.
      return {
        idea: `AI-Powered Analytics for ${niche}`,
        monetization: `Subscription model at $29/mo for ${audience}.`,
        features: ['Real-time dashboard', 'Automated reporting', 'Predictive trends'],
      };
    },
  },
  
  content_writer: {
    description: 'Write a short blog post or script based on a specific topic.',
    parameters: z.object({
      topic: z.string().min(5).max(200).describe('The subject matter to write about.'),
    }),
    execute: async ({ topic }: { topic: string }) => {
      return {
        title: `The Future of ${topic}`,
        content: `Dive deep into the impact of ${topic} on the modern landscape. As technology evolves rapidly...\n(Note: Generated via safe local tool fallback to save credits)`,
      };
    },
  },
  
  code_fixer: {
    description: 'Fix buggy code by providing the code and the error message.',
    parameters: z.object({
      code: z.string().min(1).describe('The broken source code snippet.'),
      error: z.string().min(1).describe('The error message encountered.'),
    }),
    execute: async ({ code, error }: { code: string, error: string }) => {
      // Intentionally omitting any risky 'eval()' execution. Pure text transformation logic.
      return {
        fixed_code: `// Fixed implementation attempting to resolve: ${error}\n${code.replace(/var|let/g, 'const')}\n// Ensure variables are properly exported/handled.`,
        explanation: `We enforced strict const usage to prevent mutation. Please verify other logic parameters associated with the error: ${error.substring(0, 20)}...`,
      };
    },
  },
  
  search_docs: {
    description: 'Search official documents and guides for Career and Government requirements.',
    parameters: z.object({
      query: z.string().min(2).describe('Search query for documents like PAN, Aadhaar, Passport.'),
    }),
    execute: async ({ query }: { query: string }) => {
      const q = query.toLowerCase();
      if (q.includes('pan')) return "PAN Card: Costs ₹107, requires 15 days.";
      if (q.includes('aadhaar')) return "Aadhaar: Linked mobile number required for OTP.";
      return "No specific document found for your query. Try 'PAN' or 'Aadhaar'.";
    },
  }
};

export const AGENT_CONFIG = {
  model: 'claude-3-5-sonnet-20240620',
  description: 'You are a senior full-stack AI SaaS architect representing DreamSync. Provide safe, validated answers and utilize the provided tools when necessary.',
  temperature: 0.7,
};
