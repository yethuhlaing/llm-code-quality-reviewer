import { Bot, Box, Clock, GitBranch } from 'lucide-react'
import React from 'react'
import { Card, CardContent } from './card'
import { metadata } from '../types';

export const Footer = ({ metaData }: {metaData: metadata}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        };

    const formatSha = (sha: string) => {
        return sha.substring(0, 7);
    };
  return (
    <footer className="my-8 border-t pt-4">
      <Card className="bg-slate-50">
        <CardContent className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Bot className="h-4 w-4" />
            <span className="font-semibold">Model:</span>
            <span className="font-mono">{metaData.model}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <GitBranch className="h-4 w-4" />
            <span className="font-semibold">Repo:</span>
            <a 
              href={`https://github.com/${metaData.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-blue-600 transition-colors"
            >
              {metaData.repo}
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Box className="h-4 w-4" />
            <span className="font-semibold">SHA:</span>
            <a 
              href={`https://github.com/${metaData.repo}/commit/${metaData.sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-blue-600 transition-colors"
            >
              {formatSha(metaData.sha)}
            </a>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">Generated:</span>
            <time dateTime={metaData.timestamp} className="font-mono">
              {formatDate(metaData.timestamp)}
            </time>
          </div>
        </CardContent>
      </Card>
    </footer>
  )
}