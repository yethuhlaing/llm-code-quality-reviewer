import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/card"
import { CodeReview } from '@/app/types';

interface CodeReviewDisplayProps {
  review: CodeReview;
}

export const CodeReviewDisplay: React.FC<CodeReviewDisplayProps> = ({ review }) => {
  return (
    <Card className="max-w-4xl mx-auto mt-6 ">
      <CardHeader>
        <CardTitle className="text-3xl">Code Review Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Overall Score</h2>
          <div className="text-4xl font-bold text-primary">{review.overallScore}/10</div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Summary</h2>
          <p className="text-muted-foreground">{review.summary}</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Detailed Analysis</h2>
          {Object.entries(review.detailedAnalysis).map(([key, value]) => (
            <Card key={key} className="mb-4">
              <CardHeader>
                <CardTitle className="text-xl capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Key Strengths</h2>
          <ul className="list-disc list-inside text-muted-foreground">
            {review.keyStrengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Areas for Improvement</h2>
          <ul className="list-disc list-inside text-muted-foreground">
            {review.areasForImprovement.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-2">Recommendations</h2>
          <ol className="list-decimal list-inside text-muted-foreground">
            {review.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

