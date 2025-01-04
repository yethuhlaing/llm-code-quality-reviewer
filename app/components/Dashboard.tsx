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
import { OriginalCodeDisplay } from './OriginalCodeDisplay'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CodeReview>()
  const [metaData, setMetaData] = useState<metadata>()
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [original, setOriginal] = useState<string>()
 
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
    setOriginal(undefined)
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
       
      // if (!response.ok) {
      //   throw new Error(`status: ${response.status}! error: ${response}`)
      // }
      const result = await response.json()
      if (!result.success) {
        console.error(`${result.error.type}: ${result.error.message}`);
        setError(result.error.message);
      } else {
        setMetaData(result.metadata)
        setOriginal(result.original)
        setResult(result.content)
        console.log('Data:', metaData)
        console.log('Original:', original)
      }

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
  // function extractJson(inputString: string) {
  //   // Regular expression to match JSON content inside triple backticks and within the 'json' block
  //   const regex = /```json\s([\s\S]*?)```/;
    
  //   // Match the JSON content from the string
  //   const match = inputString.match(regex);
    
  //   if (match && match[1]) {
  //     try {
  //       // Parse the matched JSON string and return it
  //       return JSON.parse(match[1]);
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       return null;
  //     }
  //   } else {
  //     console.log("No JSON content found.");
  //     return null;
  //   }
  // }

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
          {isLoading && !error ? (
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
      <div className='flex flex-col mt-4'>  
          <div>
            {original && (
              <OriginalCodeDisplay original={original} />
            )}
          </div>
          <div>
            {result && (
              <CodeReviewDisplay review={result} />
            )}
          </div>
      </div>
      {metaData && (
        <Footer metaData={metaData} />
      )}
    </div>
  )
}

