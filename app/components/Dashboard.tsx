'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/app/components/button"
import { Input } from "@/app/components/input"
import { Label } from "@/app/components/label"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/alert"
import { Loader2 } from 'lucide-react'
import { CodeReviewDisplay } from './CodeReviewDisplay'
import { Footer } from './Footer'
import { CodeReview, metadata } from '../types'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CodeReview>()
  const [metaData, setMetaData] = useState<metadata>()
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setResult(undefined)
    setError(null)

    const formData = new FormData(event.currentTarget)
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/v1/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo: formData.get('repo'),
          sha: formData.get('sha'),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const extractedData = extractJson(data.content)
      setMetaData(data.metadata)
      console.log('Data:', metaData)
      setResult(extractedData)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.name === 'AbortError' ? 'Request was cancelled' : e.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }
  function extractJson(inputString: string) {
    // Regular expression to match JSON content inside triple backticks and within the 'json' block
    const regex = /```json\s([\s\S]*?)```/;
    
    // Match the JSON content from the string
    const match = inputString.match(regex);
    
    if (match && match[1]) {
      try {
        // Parse the matched JSON string and return it
        return JSON.parse(match[1]);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
      }
    } else {
      console.log("No JSON content found.");
      return null;
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="repo">GitHub Repository</Label>
          <Input id="repo" name="repo" placeholder="owner/repo" required />
        </div>
        <div>
          <Label htmlFor="sha">File SHA</Label>
          <Input id="sha" name="sha" placeholder="40-character SHA" required />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reviewing...
            </>
          ) : (
            'Review Code'
          )}
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <CodeReviewDisplay review={result} />
      )}
      {metaData && (
        <Footer metaData={metaData} />
      )}
    </div>
  )
}

