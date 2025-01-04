// app/lib/code-review.ts
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence  } from "@langchain/core/runnables";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export class CodeReviewService {
  private model: HuggingFaceInference;
  private prompt: ChatPromptTemplate;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    this.model = new HuggingFaceInference({
      model: "microsoft/Phi-3.5-mini-instruct",
      apiKey: apiKey,
      temperature: 0.1,
      maxTokens: 1000,
      topP: 0.95,
    });

    this.prompt = ChatPromptTemplate.fromTemplate(
    `You are an expert code reviewer with years of experience in software development and best practices. Your task is to review the following code and provide a comprehensive analysis focusing on:
        
        1. Code Structure: Evaluate the overall organization and architecture of the code.
        2. Readability: Assess how easy it is to understand the code's purpose and flow.
        3. Potential Bugs: Identify any logic errors, edge cases, or potential runtime issues.
        4. Best Practices: Check if the code follows industry-standard best practices and design patterns.
        5. Performance: Consider any potential performance bottlenecks or inefficiencies.
        6. Security: Look for any security vulnerabilities or unsafe practices.
        7. Maintainability: Evaluate how easy it would be to maintain and extend this code in the future.
        
        Follow the format instructions and json schema provided below to structure your review.
        {format_instructions}
        
        Code to review:

        {code}
        `,
    )
  }


  async reviewCode(code: string) {
    const zodSchema = z.object({
      overallScore: z.number().min(0).max(10), // Ensures the number is between 0 and 10
      summary: z.string(),
      detailedAnalysis: z.object({
        codeStructure: z.string(),
        readability: z.string(),
        potentialBugs: z.string(),
        bestPractices: z.string(),
        performance: z.string(),
        security: z.string(),
        maintainability: z.string(),
      }),
      keyStrengths: z.array(z.string()),
      areasForImprovement: z.array(z.string()),
      recommendations: z.array(z.string()),
    });
    const parser = StructuredOutputParser.fromZodSchema(zodSchema);
    const chain = RunnableSequence.from([
      this.prompt,
      this.model,
      parser,
    ]);
    const response = await chain.invoke({ code, format_instructions : parser.getFormatInstructions() });
    console.log('Code review response:', response);
    return response;
  }
}
