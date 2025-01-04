import { CodeReviewService } from '@/app/lib/code-review';
import { GitHubService } from '@/app/lib/github';
import { codeReviewSchema } from '@/app/lib/validation';
import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    if (!githubToken || !hfApiKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = codeReviewSchema.parse(body);

    // Initialize services
    const githubService = new GitHubService(githubToken);
    const codeReviewService = new CodeReviewService(hfApiKey);

    // Fetch code content
    const codeContent = await githubService.fetchContent(
      validatedData.repo,
      validatedData.sha
    );
    // Generate review
    const review = await codeReviewService.reviewCode(codeContent);
    console.log('Code review:', review);
    return NextResponse.json({
      success: true,
      content: review,
      metadata: {
        repo: validatedData.repo,
        sha: validatedData.sha,
        model: 'Qwen/QwQ-32B-Preview',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Code review error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message).join('\n') },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}