import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/card"


export const OriginalCodeDisplay = ({ original } : { original : string}) => {
  return (
    <Card className="max-w-4xl mx-auto mt-6 ">
      <CardHeader>
        <CardTitle className="text-3xl">Code Review Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Original Code</h2>
          <p className="text-muted-foreground">{original}</p>
        </div>
      </CardContent>
    </Card>
  );
};

