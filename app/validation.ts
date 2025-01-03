import { z } from 'zod';

export const codeReviewSchema = z.object({
  repo: z.string()
    .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/, 
      "Repository format must be 'owner/repo' (e.g., 'facebook/react')"),
  sha: z.string()
    .regex(/^[a-f0-9]{40}$/, 
      "SHA must be a 40-character hexadecimal string from GitHub"),
});

export type CodeReviewRequest = z.infer<typeof codeReviewSchema>;