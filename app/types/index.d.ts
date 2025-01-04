export interface CodeReview {
    overallScore: number;
    summary: string;
    detailedAnalysis: {
      codeStructure: string;
      readability: string;
      potentialBugs: string;
      bestPractices: string;
      performance: string;
      security: string;
      maintainability: string;
    };
    keyStrengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  }

export interface metadata {
  model: string;     // "Qwen/QwQ-32B-Preview"
  repo: string;      // "yethuhlaing/parvi-cube"
  sha: string;       // "631257744cbf75076c4d9a8c37e3bee5eed0451f"
  timestamp: string; // "2025-01-04T02:16:18.642Z"
}