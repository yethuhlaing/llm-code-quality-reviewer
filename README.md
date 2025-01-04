
## STRIVE TECH CHALLENGE

This is a solution to the Strive Tech Challenge that involves creating a LLM code quality reviewer within 20 hours. The app includes a form that takes a GitHub repository and file SHA as parameters. Upon submission, the app fetches the file from GitHub, sends it to an LLM (Qwen/QwQ-32B-Preview) backend using Langchain and HuggingFace, and provides a clear quality score and reasoning behind the score.



https://github.com/user-attachments/assets/97e8fe42-468e-46dd-a04c-0bdd22b13884



## Features
- Fetch files from GitHub based on repository name and file SHA.
- Feed fetched file content to the LLM backend.
- Display a clear quality score and reasoning.
- Basic form input for GitHub repository and SHA.

## Installation

Clone & create this repo locally with the following command:

```bash
git clone https://github.com/yethuhlaing/llm-code-quality-reviewer.git
cd llm-code-quality-reviewer
```

### Steps

1. Install dependencies:

```sh
npm install
```

2. Copy `.env.example` to `.env` and update the variables.

```sh
cp .env.example .env
```

3. Start the development server:

```sh
npm run dev
```

## Environment Variables

- HUGGINGFACE_API_KEY: Your HuggingFace API key for accessing machine learning models
- GITHUB_TOKEN: Your GitHub personal access token for repository access

## Tech Stack + Features

- Nextjs
- React
- Tailwind / Shadcn
- HuggingFace
- Langchain
- Typescript

