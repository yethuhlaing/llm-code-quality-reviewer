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
      model: "mistralai/Mistral-7B-Instruct-v0.2",
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

      Provide your review in the following format:

      Overall Score: [Give a score out of 10, with 10 being excellent]

      Summary: [A brief 2-3 sentence overview of the code quality]

      Detailed Analysis:
      1. Code Structure: [Your analysis]
      2. Readability: [Your analysis]
      3. Potential Bugs: [Your analysis]
      4. Best Practices: [Your analysis]
      5. Performance: [Your analysis]
      6. Security: [Your analysis]
      7. Maintainability: [Your analysis]

      Key Strengths:
      - [List 2-3 main strengths of the code]

      Areas for Improvement:
      - [List 2-3 main areas where the code could be improved]

      Recommendations:
      1. [Specific recommendation]
      2. [Specific recommendation]
      3. [Specific recommendation]

      Please ensure your review is constructive, specific, and actionable.
    `,
      inputVariables: ["code"],
    });
  }

  async reviewCode(code: string) {
    const chain = this.prompt.pipe(this.model);
    return chain.invoke({ code });
  }
}
