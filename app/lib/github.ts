import { Buffer } from 'buffer';

export class GitHubService {
    private baseUrl = 'https://api.github.com';
    private token: string;
  
    constructor(token: string) {
      if (!token) {
        throw new Error('GitHub token is required');
      }
      this.token = token;
    }
  
    async fetchContent(repo: string, sha: string): Promise<string> {
      try {
        console.log(`${this.baseUrl}/repos/${repo}/git/blobs/${sha}`)
        const response = await fetch(`${this.baseUrl}/repos/${repo}/git/blobs/${sha}`, {
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${this.token}`,
            'X-GitHub-Api-Version': '2022-11-28'
          }
        });
  
        if (!response.ok) {
          const error = await response.json().catch(() => null);
          if (response.status === 404) {
            throw new Error(`Repository or SHA not found: ${repo}/${sha}`);
          }
          if (response.status === 401) {
            throw new Error('Invalid GitHub token');
          }
          if (response.status === 403) {
            throw new Error('GitHub token lacks necessary permissions or rate limit exceeded');
          }
          throw new Error(error?.message || `GitHub API error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        if (!data.content) {
          throw new Error('No content found in the GitHub response');
        }
        // const text = `
        //         if (timeRange === 'last') {
        //             fluxQuery = \`
        //                 from(bucket: "\${bucket}")
        //                     |> range(start: -5s) 
        //                     |> filter(fn: (r) => r["sensor"] == "\${sensor}") // Use double quotes for tag keys
        //                     |> keep(columns: ["_value", "_field"])
        //                     |> last()
        //             \`;
        //         } else {
        //             const start = lastTimestamp ? lastTimestamp : \`-\${timeRange}\`;
        //             const downsamplingInterval = timeRange > '1h' ? '5s' : '1s'; // Adjust downsampling interval as needed
            
        //             fluxQuery = \`
        //                 from(bucket: "\${bucket}")
        //                     |> range(start: \${start})
        //                     |> filter(fn: (r) => r["sensor"] == "\${sensor}") // Use double quotes for tag keys
        //                     |> keep(columns: ["_value", "_time", "_field", "_measurement", "sensor_id"]) 
        //                     |> aggregateWindow(every: \${downsamplingInterval}, fn: mean) 
        //             \`;
        //         }
        //     `;
        // return text
        // Decode the Base64 string


            // Check if the encoding is base64
        if (data.encoding !== 'base64') {
            throw new Error(`Unsupported encoding: ${data.encoding}`);
        }
    
        // Decode the Base64 content
        const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
        return decodedContent
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`GitHub API Error: ${error.message}`);
        }
        if (typeof error === 'object' && error !== null && 'message' in error) {
          return (error as Error).message;
        }
        return String(error);
      }
    }
  }