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