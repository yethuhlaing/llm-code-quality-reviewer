// app/lib/code-review.ts
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PromptTemplate } from "@langchain/core/prompts";

export class CodeReviewService {
  private model: HuggingFaceInference;
  private prompt: PromptTemplate;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    this.model = new HuggingFaceInference({
      model: "Qwen/QwQ-32B-Preview",
      apiKey: apiKey,
      temperature: 0.1,
      maxTokens: 1000,
      topP: 0.95,
    });

    this.prompt = new PromptTemplate({
      template: `
      You are an expert code reviewer with years of experience in software development and best practices. Your task is to review the following code and provide a comprehensive analysis. Focus on the following aspects:
      
      1. Code Structure: Evaluate the overall organization and architecture of the code.
      2. Readability: Assess how easy it is to understand the code's purpose and flow.
      3. Potential Bugs: Identify any logic errors, edge cases, or potential runtime issues.
      4. Best Practices: Check if the code follows industry-standard best practices and design patterns.
      5. Performance: Consider any potential performance bottlenecks or inefficiencies.
      6. Security: Look for any security vulnerabilities or unsafe practices.
      7. Maintainability: Evaluate how easy it would be to maintain and extend this code in the future.
      
      Code to review:
      {code}
      
      Provide your review in the following JSON format:
      
      {{
        "overallScore": <number between 0 and 10>,
        "summary": "<A brief 2-3 sentence overview of the code quality>",
        "detailedAnalysis": {{
          "codeStructure": "<Your analysis>",
          "readability": "<Your analysis>",
          "potentialBugs": "<Your analysis>",
          "bestPractices": "<Your analysis>",
          "performance": "<Your analysis>",
          "security": "<Your analysis>",
          "maintainability": "<Your analysis>"
        }},
        "keyStrengths": [
          "<Strength 1>",
          "<Strength 2>",
          "<Strength 3>"
        ],
        "areasForImprovement": [
          "<Area 1>",
          "<Area 2>",
          "<Area 3>"
        ],
        "recommendations": [
          "<Specific recommendation 1>",
          "<Specific recommendation 2>",
          "<Specific recommendation 3>"
        ]
      }}
      
      Ensure your review is constructive, specific, and actionable. Provide the response as a valid JSON object, replacing the placeholders with your actual review content. Do not include any explanation or text outside of the JSON structure.
      `,
      inputVariables: ["code"],
    });
  }

  async reviewCode(code: string) {
    const chain = this.prompt.pipe(this.model);
    return chain.invoke({ code });
  }
}
